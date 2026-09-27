require('dotenv').config();
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { readDB, writeDB } = require('./db');
const { sendVerificationEmail } = require('./mailer');
const { sendVerificationSms } = require('./sms');
const { generatePayment, verifyPayment } = require('./flouci');

const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const CODE_TTL_MS = 10 * 60 * 1000;
const APP_URL = process.env.APP_URL || `http://localhost:${PORT}`;
const SUBSCRIPTION_PRICE_MILLIMES = Number(process.env.SUBSCRIPTION_PRICE_MILLIMES || 29000); // 29.000 د.ت افتراضيًا

app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const isEmail = v => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v);
const isPhone = v => /^[0-9+\s]{8,15}$/.test(v);
const genCode = () => String(Math.floor(100000 + Math.random() * 900000));
const signToken = uid => jwt.sign({ uid }, JWT_SECRET, { expiresIn: '30d' });

function authRequired(req, res, next) {
  const token = req.cookies.sahnak_token;
  if (!token) return res.status(401).json({ error: 'يجب تسجيل الدخول' });
  try {
    req.userId = jwt.verify(token, JWT_SECRET).uid;
    next();
  } catch {
    return res.status(401).json({ error: 'جلسة غير صالحة، سجّل الدخول من جديد' });
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

// ---------------- AUTH: SIGNUP (email or phone) ----------------
app.post('/api/signup/request-code', async (req, res) => {
  const { identifier, password, confirmPassword, method } = req.body || {};
  if (!identifier || !password) return res.status(400).json({ error: 'البيانات ناقصة' });
  if (method === 'email' && !isEmail(identifier)) return res.status(400).json({ error: 'بريد إلكتروني غير صحيح' });
  if (method === 'phone' && !isPhone(identifier)) return res.status(400).json({ error: 'رقم هاتف غير صحيح' });
  if (password.length < 8) return res.status(400).json({ error: 'كلمة المرور يجب أن تكون 8 أحرف على الأقل' });
  if (password !== confirmPassword) return res.status(400).json({ error: 'كلمتا المرور غير متطابقتين' });

  const db = readDB();
  if (db.users.find(u => u.identifier === identifier)) {
    return res.status(400).json({ error: 'يوجد حساب مسجّل بهذه البيانات مسبقًا، جرّب تسجيل الدخول' });
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
    return res.status(500).json({ error: 'تعذّر إرسال رمز التحقق الآن، حاول لاحقًا' });
  }
  res.json({ ok: true, simulated: result.simulated });
});

app.post('/api/signup/verify', (req, res) => {
  const { identifier, code } = req.body || {};
  const db = readDB();
  const pending = db.pendingCodes.find(p => p.identifier === identifier);
  if (!pending) return res.status(400).json({ error: 'لم يتم طلب رمز لهذا الحساب' });
  if (Date.now() > pending.expiresAt) return res.status(400).json({ error: 'انتهت صلاحية الرمز، اطلب رمزًا جديدًا' });
  if (pending.code !== code) return res.status(400).json({ error: 'الرمز غير صحيح' });

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
  if (!user) return res.status(400).json({ error: 'بيانات الدخول غير صحيحة أو الحساب غير موجود' });
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(400).json({ error: 'بيانات الدخول غير صحيحة أو الحساب غير موجود' });

  res.cookie('sahnak_token', signToken(user.id), { httpOnly: true, sameSite: 'lax', maxAge: 30 * 24 * 3600 * 1000 });
  res.json({ ok: true, redirect: '/dashboard.html' });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('sahnak_token');
  res.json({ ok: true });
});

app.get('/api/me', authRequired, (req, res) => {
  const db = readDB();
  const user = db.users.find(u => u.id === req.userId);
  if (!user) return res.status(401).json({ error: 'المستخدم غير موجود' });
  res.json({ identifier: user.identifier, method: user.method, subscribed: !!user.subscribed });
});

// ---------------- BILLING (real Flouci payment) ----------------
app.post('/api/billing/create-checkout-session', authRequired, async (req, res) => {
  if (!process.env.FLOUCI_PUBLIC_KEY || !process.env.FLOUCI_PRIVATE_KEY) {
    return res.status(500).json({ error: 'لم يتم إعداد Flouci بعد، أضف FLOUCI_PUBLIC_KEY و FLOUCI_PRIVATE_KEY في ملف .env' });
  }
  try {
    const { paymentId, link } = await generatePayment({
      amountMillimes: SUBSCRIPTION_PRICE_MILLIMES,
      developerTrackingId: req.userId,
      successLink: `${APP_URL}/api/billing/flouci-success`,
      failLink: `${APP_URL}/billing.html?canceled=1`,
      webhook: `${APP_URL}/api/billing/flouci-webhook`,
      clientId: req.userId
    });
    const db = readDB();
    db.pendingPayments = db.pendingPayments || [];
    db.pendingPayments.push({ paymentId, userId: req.userId, createdAt: Date.now() });
    writeDB(db);
    res.json({ url: link });
  } catch (e) {
    res.status(500).json({ error: 'تعذّر إنشاء جلسة الدفع: ' + e.message });
  }
});

// يعيد Flouci توجيه المستخدم إلى هنا بعد الدفع الناجح؛ نتحقق فعليًا من الحالة قبل تفعيل الاشتراك
app.get('/api/billing/flouci-success', async (req, res) => {
  let userId = null;
  try { userId = jwt.verify(req.cookies.sahnak_token, JWT_SECRET).uid; } catch { /* not logged in / cookie missing */ }
  if (userId) {
    const db = readDB();
    db.pendingPayments = db.pendingPayments || [];
    const pending = [...db.pendingPayments].reverse().find(p => p.userId === userId);
    if (pending) {
      try {
        const result = await verifyPayment(pending.paymentId);
        if (result.status === 'SUCCESS') {
          const user = db.users.find(u => u.id === userId);
          if (user) user.subscribed = true;
          db.pendingPayments = db.pendingPayments.filter(p => p.paymentId !== pending.paymentId);
          writeDB(db);
        }
      } catch (e) {
        console.error('تعذّر التحقق من الدفع عبر Flouci:', e.message);
      }
    }
  }
  res.redirect('/dashboard.html');
});

// إشعار خادم-إلى-خادم من Flouci عند اكتمال الدفع (أكثر موثوقية من الاعتماد على التوجيه وحده)
app.post('/api/billing/flouci-webhook', async (req, res) => {
  try {
    const paymentId = req.body.payment_id || (req.body.result && req.body.result.payment_id) || req.body.id;
    if (paymentId) {
      const result = await verifyPayment(paymentId);
      if (result.status === 'SUCCESS') {
        const db = readDB();
        db.pendingPayments = db.pendingPayments || [];
        const pending = db.pendingPayments.find(p => p.paymentId === paymentId);
        if (pending) {
          const user = db.users.find(u => u.id === pending.userId);
          if (user) user.subscribed = true;
          db.pendingPayments = db.pendingPayments.filter(p => p.paymentId !== paymentId);
          writeDB(db);
        }
      }
    }
  } catch (e) {
    console.error('خطأ في webhook الخاص بـ Flouci:', e.message);
  }
  res.json({ received: true });
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
  const { name, slug, desc, sections, published } = req.body || {};
  const db = readDB();
  const r = db.restaurants.find(r => r.ownerId === req.userId);
  if (!r) return res.status(404).json({ error: 'لم يتم العثور على المطعم' });

  if (published && slug) {
    const clash = db.restaurants.find(x => x.slug === slug && x.ownerId !== req.userId && x.published);
    if (clash) return res.status(400).json({ error: 'الرابط المختصر مستخدم من مطعم آخر، اختر رابطًا مختلفًا' });
  }

  if (name !== undefined) r.name = name;
  if (slug !== undefined) r.slug = slug;
  if (desc !== undefined) r.desc = desc;
  if (Array.isArray(sections)) r.sections = sections;
  if (typeof published === 'boolean') r.published = published;
  writeDB(db);
  res.json(r);
});

// ---------------- PUBLIC MENU (no auth) ----------------
app.get('/api/public/:slug', (req, res) => {
  const db = readDB();
  const r = db.restaurants.find(r => r.slug === req.params.slug && r.published);
  if (!r) return res.status(404).json({ error: 'هذا المنيو غير متاح' });
  res.json({ name: r.name, desc: r.desc, sections: r.sections });
});

app.listen(PORT, () => console.log(`✅ صحنك يعمل على http://localhost:${PORT}`));
