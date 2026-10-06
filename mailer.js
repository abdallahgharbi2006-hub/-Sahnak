const nodemailer = require('nodemailer');

function getTransporter() {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER) return null;
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  });
}

async function sendVerificationEmail(to, code) {
  const transporter = getTransporter();
  if (!transporter) {
    console.log(`[وضع تجريبي - لا يوجد إعداد SMTP في .env] رمز التحقق لـ ${to}: ${code}`);
    return { simulated: true };
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: 'رمز التحقق - صحنك',
    text: `رمز التحقق الخاص بك هو: ${code}\nصالح لمدة 10 دقائق.`,
    html: `<div dir="rtl" style="font-family:sans-serif">
      <h2>رمز التحقق الخاص بك في صحنك</h2>
      <p style="font-size:28px;font-weight:bold;letter-spacing:4px;">${code}</p>
      <p>هذا الرمز صالح لمدة 10 دقائق. إن لم تطلب هذا الرمز يمكنك تجاهل هذه الرسالة.</p>
    </div>`
  });
  return { simulated: false };
}

async function sendPasswordResetEmail(to, link) {
  const transporter = getTransporter();
  if (!transporter) {
    console.log(`[وضع تجريبي - لا يوجد إعداد SMTP في .env] رابط استعادة كلمة المرور لـ ${to}: ${link}`);
    return { simulated: true };
  }
  await transporter.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to,
    subject: 'استعادة كلمة المرور - صحنك',
    text: `اضغط الرابط التالي لتعيين كلمة مرور جديدة:\n${link}\nصالح لمدة 30 دقيقة. إن لم تطلب هذا يمكنك تجاهل الرسالة.`,
    html: `<div dir="rtl" style="font-family:sans-serif">
      <h2>استعادة كلمة المرور في صحنك</h2>
      <p>اضغط الزر التالي لتعيين كلمة مرور جديدة:</p>
      <p><a href="${link}" style="background:#e0632a;color:#fff;padding:12px 24px;border-radius:10px;text-decoration:none;display:inline-block;">تعيين كلمة مرور جديدة</a></p>
      <p style="color:#7a6a5c;font-size:13px;">هذا الرابط صالح لمدة 30 دقيقة. إن لم تطلب هذا يمكنك تجاهل هذه الرسالة.</p>
    </div>`
  });
  return { simulated: false };
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
