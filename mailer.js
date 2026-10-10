// إرسال البريد. الترتيب:
//  1) Brevo عبر HTTPS (يعمل على Render المجاني، لأن منافذ SMTP محجوبة هناك منذ سبتمبر 2025)
//  2) SMTP عبر nodemailer (يعمل محليًا أو على استضافة مدفوعة)
//  3) وضع تجريبي: يطبع الرسالة في السجلات بدل إرسالها
const nodemailer = require('nodemailer');

function brevoConfigured() {
  return !!process.env.BREVO_API_KEY && !!process.env.MAIL_FROM_EMAIL;
}

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
}

async function sendViaBrevo({ to, subject, text, html }) {
  const res = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: { 'api-key': process.env.BREVO_API_KEY, 'content-type': 'application/json', accept: 'application/json' },
    body: JSON.stringify({
      sender: { name: process.env.MAIL_FROM_NAME || 'صحنك', email: process.env.MAIL_FROM_EMAIL },
      to: [{ email: to }],
      subject,
      textContent: text,
      htmlContent: html
    }),
    signal: AbortSignal.timeout(15000)
  });
  if (!res.ok) {
    let detail = '';
    try { const j = await res.json(); detail = j.message || JSON.stringify(j); } catch (e) { /* لا يوجد جسم */ }
    throw new Error(`Brevo ${res.status}: ${detail}`);
  }
}

async function deliver(msg, devLine) {
  if (brevoConfigured()) {
    await sendViaBrevo(msg);
    return { simulated: false };
  }
  const transporter = getTransporter();
  if (transporter) {
    await transporter.sendMail({ from: process.env.SMTP_FROM || process.env.SMTP_USER, ...msg });
    return { simulated: false };
  }
  console.log(devLine);
  return { simulated: true };
}

async function sendVerificationEmail(to, code) {
  return deliver({
    to,
    subject: 'رمز التحقق - صحنك',
    text: `رمز التحقق الخاص بك هو: ${code}\nصالح لمدة 10 دقائق.`,
    html: `<div dir="rtl" style="font-family:sans-serif">
      <h2>رمز التحقق الخاص بك في صحنك</h2>
      <p style="font-size:28px;font-weight:bold;letter-spacing:4px;">${code}</p>
      <p>هذا الرمز صالح لمدة 10 دقائق. إن لم تطلب هذا الرمز يمكنك تجاهل هذه الرسالة.</p>
    </div>`
  }, `[وضع تجريبي - لا يوجد إعداد بريد] رمز التحقق لـ ${to}: ${code}`);
}

async function sendPasswordResetEmail(to, link) {
  return deliver({
    to,
    subject: 'استعادة كلمة المرور - صحنك',
    text: `اضغط الرابط التالي لتعيين كلمة مرور جديدة:\n${link}\nصالح لمدة 30 دقيقة. إن لم تطلب هذا يمكنك تجاهل الرسالة.`,
    html: `<div dir="rtl" style="font-family:sans-serif">
      <h2>استعادة كلمة المرور في صحنك</h2>
      <p>اضغط الزر التالي لتعيين كلمة مرور جديدة:</p>
      <p><a href="${link}" style="background:#e0632a;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;display:inline-block;">تعيين كلمة مرور جديدة</a></p>
      <p style="color:#7a6a5c;font-size:13px;">هذا الرابط صالح لمدة 30 دقيقة. إن لم تطلب هذا يمكنك تجاهل هذه الرسالة.</p>
    </div>`
  }, `[وضع تجريبي - لا يوجد إعداد بريد] رابط استعادة كلمة المرور لـ ${to}: ${link}`);
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
