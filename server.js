require('dotenv').config();
const express = require('express');
const path = require('path');
const crypto = require('crypto');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { initDB, readDB, writeDB, flush } = require('./db');
const { sendVerificationEmail, sendPasswordResetEmail } = require('./mailer');
const { sendVerificationSms } = require('./sms');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const ADMIN_JWT_SECRET = JWT_SECRET + '_admin_panel';
const CODE_TTL_MS = 10 * 60 * 1000;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
const SUBSCRIPTION_PRICE_MILLIMES = Number(process.env.SUBSCRIPTION_PRICE_MILLIMES || 29000); // 29.000 د.ت افتراضيًا

app.use(express.json({ limit: '4mb' })); // رُفع الحد للسماح برفع صورة غلاف المطعم (base64)
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const isEmail = v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
const isPhone = v => /^[0-9+\s]{8,15}$/.test(v);
const genCode = () => String(Math.floor(100000 + Math.random() * 900000));
const signToken = uid => jwt.sign({ uid }, JWT_SECRET, { expiresIn: '30d' });

function authRequired(req, res, next) {
  const token = req.cookies.sahnak_token;
  if (!token) return res.status(401).json({ error: 'يجب تسجيل الدخول', code: 'AUTH_REQUIRED' });
  try {
    req.userId = jwt.verify(token, JWT_SECRET).uid;
    next();
  } catch {
    return res.status(401).json({ error: 'جلسة غير صالحة، سجّل الدخول من جديد', code: 'INVALID_SESSION' });
  }
}

function subscriptionRequired(req, res, next) {
  const db = readDB();
  const user = db.users.find(u => u.id === req.userId);
  if (!user || !user.subscribed) {
    return res.status(402).json({ error: 'يجب الاشتراك أولًا للوصول إلى هذه الخدمة', code: 'SUBSCRIPTION_REQUIRED' });
  }
  next();
}

function adminRequired(req, res, next) {
  const token = req.cookies.sahnak_admin_token;
  if (!token) return res.status(401).json({ error: 'يجب تسجيل دخول المشرف', code: 'ADMIN_AUTH_REQUIRED' });
  try {
    jwt.verify(token, ADMIN_JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'جلسة مشرف غير صالحة، سجّل الدخول من جديد', code: 'ADMIN_INVALID_SESSION' });
  }
}

// ---------------- AUTH: SIGNUP (email or phone) ----------------
// التسجيل برقم الهاتف معطّل افتراضيًا لأنه يحتاج مزوّد SMS حقيقيًا (وإلا لن يصل الرمز للمستخدم)
const PHONE_SIGNUP_ENABLED = process.env.ENABLE_PHONE_SIGNUP === 'true';
app.get('/api/config', (req, res) => res.json({ phoneSignup: PHONE_SIGNUP_ENABLED }));

app.post('/api/signup/request-code', async (req, res) => {
  const { identifier, password, confirmPassword, method } = req.body || {};
  if (method === 'phone' && !PHONE_SIGNUP_ENABLED) {
    return res.status(403).json({ error: 'التسجيل برقم الهاتف غير متاح حاليًا، استخدم بريدك الإلكتروني', code: 'PHONE_SIGNUP_DISABLED' });
  }
  if (!identifier || !password) return res.status(400).json({ error: 'البيانات ناقصة', code: 'MISSING_FIELDS' });
  if (method === 'email' && !isEmail(identifier)) return res.status(400).json({ error: 'بريد إلكتروني غير صحيح', code: 'BAD_EMAIL' });
  if (method === 'phone' && !isPhone(identifier)) return res.status(400).json({ error: 'رقم هاتف غير صحيح', code: 'BAD_PHONE' });
  if (password.length < 8) return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل', code: 'SHORT_PASSWORD' });
  if (password !== confirmPassword) return res.status(400).json({ error: 'كلمتا المرور غير متطابقتين', code: 'PASSWORD_MISMATCH' });

  const db = readDB();
  if (db.users.find(u => u.identifier === identifier)) {
    return res.status(400).json({ error: 'يوجد حساب مسجّل بهذه البيانات مسبقًا، جرّب تسجيل الدخول', code: 'ACCOUNT_EXISTS' });
  }

  const code = genCode();
  const passwordHash = await bcrypt.hash(password, 10);
  db.pendingCodes = db.pendingCodes.filter(p => p.identifier !== identifier);
  db.pendingCodes.push({ identifier, method, passwordHash, code, expiresAt: Date.now() + CODE_TTL_MS });
  writeDB(db);

  let result;
  try {
    result = method === 'email' ? await sendVerificationEmail(identifier, code) : await sendVerificationSms(identifier, code);
  } catch (e) {
    console.error('فشل إرسال رمز التحقق:', e.message);
    return res.status(500).json({ error: 'تعذّر إرسال رمز التحقق الآن، حاول لاحقًا', code: 'SEND_CODE_FAILED' });
  }
  res.json({ ok: true, simulated: result.simulated });
});

app.post('/api/signup/verify', (req, res) => {
  const { identifier, code } = req.body || {};
  const db = readDB();
  const pending = db.pendingCodes.find(p => p.identifier === identifier);
  if (!pending) return res.status(400).json({ error: 'لم يتم طلب رمز لهذا الحساب', code: 'NO_PENDING_CODE' });
  if (Date.now() > pending.expiresAt) return res.status(400).json({ error: 'انتهت صلاحية الرمز، اطلب رمزًا جديدًا', code: 'CODE_EXPIRED' });
  if (pending.code !== code) return res.status(400).json({ error: 'الرمز غير صحيح', code: 'WRONG_CODE' });

  const user = {
    id: 'u_' + Date.now(),
    identifier: pending.identifier,
    method: pending.method,
    passwordHash: pending.passwordHash,
    subscribed: false,
    createdAt: new Date().toISOString()
  };
  db.users.push(user);
  db.pendingCodes = db.pendingCodes.filter(p => p.identifier !== identifier);
  db.restaurants.push({ id: 'r_' + Date.now(), ownerId: user.id, name: '', slug: '', desc: '', published: false, sections: [] });
  writeDB(db);

  res.cookie('sahnak_token', signToken(user.id), { httpOnly: true, sameSite: 'lax', maxAge: 30 * 24 * 3600 * 1000 });
  res.json({ ok: true, redirect: '/dashboard.html' });
});

// ---------------- AUTH: LOGIN ----------------
app.post('/api/login', async (req, res) => {
  const { identifier, password } = req.body || {};
  const db = readDB();
  const user = db.users.find(u => u.identifier === identifier);
  if (!user) return res.status(400).json({ error: 'بيانات الدخول غير صحيحة أو الحساب غير موجود', code: 'INVALID_LOGIN' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'بيانات الدخول غير صحيحة أو الحساب غير موجود', code: 'INVALID_LOGIN' });

  res.cookie('sahnak_token', signToken(user.id), { httpOnly: true, sameSite: 'lax', maxAge: 30 * 24 * 3600 * 1000 });
  res.json({ ok: true, redirect: '/dashboard.html' });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('sahnak_token');
  res.json({ ok: true });
});

// ---------------- PASSWORD RESET (via email) ----------------
app.post('/api/password/forgot', async (req, res) => {
  const { identifier, recoveryEmail } = req.body || {};
  if (!identifier) return res.status(400).json({ error: 'أدخل بريدك الإلكتروني أو رقم هاتفك', code: 'MISSING_IDENTIFIER' });
  const db = readDB();
  const user = db.users.find(u => u.identifier === identifier);
  if (!user) return res.status(404).json({ error: 'لا يوجد حساب مسجّل بهذه البيانات', code: 'ACCOUNT_NOT_FOUND' });

  let targetEmail = null;
  if (user.method === 'email') {
    targetEmail = user.identifier;
  } else {
    // حساب مسجّل برقم هاتف: نطلب بريدًا إلكترونيًا لإرسال الرابط إليه، ونحفظه لاستخدامه في المرات القادمة
    if (recoveryEmail) {
      if (!isEmail(recoveryEmail)) return res.status(400).json({ error: 'أدخل بريدًا إلكترونيًا صحيحًا', code: 'BAD_EMAIL' });
      user.recoveryEmail = recoveryEmail;
      targetEmail = recoveryEmail;
    } else if (user.recoveryEmail) {
      targetEmail = user.recoveryEmail;
    } else {
      return res.json({ needsEmail: true, message: 'هذا الحساب مسجّل برقم هاتف، أدخل بريدًا إلكترونيًا لإرسال رابط الاستعادة إليه' });
    }
  }

  const token = crypto.randomBytes(24).toString('hex');
  db.passwordResets = (db.passwordResets || []).filter(r => r.userId !== user.id); // إلغاء أي روابط سابقة
  db.passwordResets.push({ token, userId: user.id, expiresAt: Date.now() + 30 * 60 * 1000 });
  writeDB(db);

  const link = `${APP_URL}/reset-password.html?token=${token}`;
  try {
    const result = await sendPasswordResetEmail(targetEmail, link);
    res.json({ ok: true, simulated: result.simulated, sentTo: targetEmail });
  } catch (e) {
    console.error('فشل إرسال رابط استعادة كلمة المرور:', e.message);
    res.status(500).json({ error: 'تعذّر إرسال رابط الاستعادة الآن، حاول لاحقًا', code: 'SEND_RESET_FAILED' });
  }
});

app.post('/api/password/reset', async (req, res) => {
  const { token, password, confirmPassword } = req.body || {};
  if (!token) return res.status(400).json({ error: 'رابط غير صالح', code: 'INVALID_TOKEN' });
  if (!password || password.length < 8) return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل', code: 'SHORT_PASSWORD' });
  if (password !== confirmPassword) return res.status(400).json({ error: 'كلمتا المرور غير متطابقتين', code: 'PASSWORD_MISMATCH' });

  const db = readDB();
  db.passwordResets = db.passwordResets || [];
  const reset = db.passwordResets.find(r => r.token === token);
  if (!reset || Date.now() > reset.expiresAt) {
    return res.status(400).json({ error: 'انتهت صلاحية الرابط أو أنه غير صالح، اطلب رابطًا جديدًا', code: 'TOKEN_EXPIRED' });
  }
  const user = db.users.find(u => u.id === reset.userId);
  if (!user) return res.status(404).json({ error: 'المستخدم غير موجود', code: 'USER_NOT_FOUND' });

  user.passwordHash = await bcrypt.hash(password, 10);
  db.passwordResets = db.passwordResets.filter(r => r.token !== token);
  writeDB(db);
  res.json({ ok: true });
});

app.get('/api/me', authRequired, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(401).json({ error: 'المستخدم غير موجود', code: 'USER_NOT_FOUND' });
  res.json({ identifier: user.identifier, method: user.method, subscribed: !!user.subscribed });
});

// ---------------- BILLING (manual transfer, confirmed by the site owner) ----------------
app.get('/api/billing/info', (req, res) => {
  res.json({
    amountText: `${(SUBSCRIPTION_PRICE_MILLIMES / 1000).toFixed(3)} د.ت`,
    phone: process.env.PAYMENT_PHONE || '',
    rib: process.env.PAYMENT_RIB || '',
    label: process.env.PAYMENT_METHOD_LABEL || 'Flouci',
    instructions: process.env.PAYMENT_INSTRUCTIONS || ''
  });
});

app.post('/api/billing/manual-claim', authRequired, (req, res) => {
  const db = readDB();
  db.paymentClaims = db.paymentClaims || [];
  const existingPending = db.paymentClaims.find(c => c.userId === req.userId && c.status === 'pending');
  if (existingPending) return res.json({ ok: true, claim: existingPending });

  const user = db.users.find(u => u.id === req.userId);
  const claim = {
    id: 'c_' + Date.now(),
    userId: req.userId,
    identifier: user ? user.identifier : '',
    note: (req.body && String(req.body.note || '').slice(0, 300)) || '',
    status: 'pending',
    createdAt: new Date().toISOString()
  };
  db.paymentClaims.push(claim);
  writeDB(db);
  res.json({ ok: true, claim });
});

app.get('/api/billing/my-claim', authRequired, (req, res) => {
  const db = readDB();
  db.paymentClaims = db.paymentClaims || [];
  const claim = [...db.paymentClaims].reverse().find(c => c.userId === req.userId);
  res.json({ claim: claim || null });
});

// ---------------- ADMIN PANEL (site owner reviews and approves payment claims manually) ----------------
app.post('/api/admin/login', (req, res) => {
  if (!process.env.ADMIN_PASSWORD) {
    return res.status(500).json({ error: 'لم يتم إعداد ADMIN_PASSWORD في ملف .env', code: 'ADMIN_NOT_CONFIGURED' });
  }
  const { password } = req.body || {};
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'كلمة مرور المشرف غير صحيحة', code: 'ADMIN_WRONG_PASSWORD' });
  }
  const token = jwt.sign({ admin: true }, ADMIN_JWT_SECRET, { expiresIn: '7d' });
  res.cookie('sahnak_admin_token', token, { httpOnly: true, sameSite: 'lax', maxAge: 7 * 24 * 3600 * 1000 });
  res.json({ ok: true });
});

app.post('/api/admin/logout', (req, res) => {
  res.clearCookie('sahnak_admin_token');
  res.json({ ok: true });
});

app.get('/api/admin/claims', adminRequired, (req, res) => {
  const db = readDB();
  db.paymentClaims = db.paymentClaims || [];
  res.json({ claims: [...db.paymentClaims].reverse() });
});

app.post('/api/admin/claims/:id/approve', adminRequired, (req, res) => {
  const db = readDB();
  db.paymentClaims = db.paymentClaims || [];
  const claim = db.paymentClaims.find(c => c.id === req.params.id);
  if (!claim) return res.status(404).json({ error: 'الطلب غير موجود', code: 'CLAIM_NOT_FOUND' });
  claim.status = 'approved';
  const user = db.users.find(u => u.id === claim.userId);
  if (user) user.subscribed = true;
  writeDB(db);
  res.json({ ok: true });
});

app.post('/api/admin/claims/:id/reject', adminRequired, (req, res) => {
  const db = readDB();
  db.paymentClaims = db.paymentClaims || [];
  const claim = db.paymentClaims.find(c => c.id === req.params.id);
  if (!claim) return res.status(404).json({ error: 'الطلب غير موجود', code: 'CLAIM_NOT_FOUND' });
  claim.status = 'rejected';
  writeDB(db);
  res.json({ ok: true });
});

// ---------------- RESTAURANT (protected: requires login AND active subscription) ----------------
app.get('/api/restaurant', authRequired, subscriptionRequired, (req, res) => {
  const db = readDB();
  let r = db.restaurants.find(r => r.ownerId === req.userId);
  if (!r) {
    r = { id: 'r_' + Date.now(), ownerId: req.userId, name: '', slug: '', desc: '', published: false, sections: [] };
    db.restaurants.push(r);
    writeDB(db);
  }
  res.json(r);
});

app.put('/api/restaurant', authRequired, subscriptionRequired, (req, res) => {
  const { name, slug, desc, sections, published, brandColor, coverImage } = req.body || {};
  const db = readDB();
  const r = db.restaurants.find(r => r.ownerId === req.userId);
  if (!r) return res.status(404).json({ error: 'لم يتم العثور على المطعم', code: 'RESTAURANT_NOT_FOUND' });

  if (published && slug) {
    const clash = db.restaurants.find(x => x.slug === slug && x.ownerId !== req.userId && x.published);
    if (clash) return res.status(400).json({ error: 'الرابط المختصر مستخدم من مطعم آخر، اختر رابطًا مختلفًا', code: 'SLUG_TAKEN' });
  }
  // تحقق بسيط من صيغة لون الهوية (hex) حتى لا تُخزَّن قيمة غير صالحة
  if (brandColor !== undefined && !/^#[0-9a-fA-F]{6}$/.test(brandColor)) {
    return res.status(400).json({ error: 'لون غير صالح', code: 'BAD_COLOR' });
  }
  // حد أقصى تقريبي لحجم صورة الغلاف (نحو 3 ميغابايت بعد ترميز base64) لحماية قاعدة البيانات
  if (coverImage !== undefined && coverImage !== null && coverImage.length > 4_000_000) {
    return res.status(400).json({ error: 'حجم الصورة كبير جدًا', code: 'IMAGE_TOO_LARGE' });
  }

  if (name !== undefined) r.name = name;
  if (slug !== undefined) r.slug = slug;
  if (desc !== undefined) r.desc = desc;
  if (Array.isArray(sections)) r.sections = sections;
  if (typeof published === 'boolean') r.published = published;
  if (brandColor !== undefined) r.brandColor = brandColor;
  if (coverImage !== undefined) r.coverImage = coverImage; // data URI (base64) أو null لإزالتها
  writeDB(db);
  res.json(r);
});

// ---------------- PUBLIC MENU (no auth) ----------------
app.get('/api/public/:slug', (req, res) => {
  const db = readDB();
  const r = db.restaurants.find(r => r.slug === req.params.slug && r.published);
  if (!r) return res.status(404).json({ error: 'هذا المنيو غير متاح', code: 'MENU_NOT_AVAILABLE' });
  res.json({ name: r.name, desc: r.desc, sections: r.sections, brandColor: r.brandColor || null, coverImage: r.coverImage || null });
});

initDB()
  .then(() => app.listen(PORT, () => console.log(`✅ صحنك يعمل على http://localhost:${PORT}`)))
  .catch(e => { console.error('❌ فشل تهيئة قاعدة البيانات:', e.message); process.exit(1); });

// عند إيقاف الخدمة (إعادة نشر/خمول) ننتظر انتهاء آخر حفظ حتى لا نفقد بيانات
process.on('SIGTERM', async () => { await flush(); process.exit(0); });
