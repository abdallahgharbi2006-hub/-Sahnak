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

module.exports = { sendVerificationEmail };
