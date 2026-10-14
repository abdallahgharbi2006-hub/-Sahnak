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
      sender: { name: process.env.MAIL_FROM_NAME || 'Sahnak', email: process.env.MAIL_FROM_EMAIL },
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

// كل رسائل العملاء بالإنجليزية (لغة مشتركة لجمهور عالمي)، بغضّ النظر عن لغة واجهة الموقع
const emailShell = (inner) => `<div style="font-family:Arial,Helvetica,sans-serif;max-width:480px;margin:0 auto;padding:8px;color:#231a14;">${inner}
  <p style="color:#7a6a5c;font-size:12px;margin-top:28px;">Sahnak — digital menus for restaurants and cafes.</p></div>`;

async function sendVerificationEmail(to, code) {
  return deliver({
    to,
    subject: 'Your Sahnak verification code',
    text: `Your Sahnak verification code is: ${code}\n\nIt is valid for 10 minutes. If you did not request it, you can safely ignore this email.`,
    html: emailShell(`
      <h2 style="margin:0 0 12px;">Your Sahnak verification code</h2>
      <p>Enter this code to finish creating your account:</p>
      <p style="font-size:30px;font-weight:bold;letter-spacing:5px;margin:16px 0;">${code}</p>
      <p style="color:#7a6a5c;font-size:13px;">This code is valid for 10 minutes. If you did not request it, you can safely ignore this email.</p>`)
  }, `[وضع تجريبي - لا يوجد إعداد بريد] رمز التحقق لـ ${to}: ${code}`);
}

async function sendPasswordResetEmail(to, link) {
  return deliver({
    to,
    subject: 'Reset your Sahnak password',
    text: `We received a request to reset your Sahnak password.\n\nOpen this link to choose a new password:\n${link}\n\nThe link is valid for 30 minutes. If you did not request it, you can safely ignore this email.`,
    html: emailShell(`
      <h2 style="margin:0 0 12px;">Reset your Sahnak password</h2>
      <p>We received a request to reset your password. Click the button below to choose a new one:</p>
      <p style="margin:20px 0;"><a href="${link}" style="background:#e0632a;color:#ffffff;padding:12px 24px;border-radius:10px;text-decoration:none;display:inline-block;font-weight:bold;">Choose a new password</a></p>
      <p style="color:#7a6a5c;font-size:13px;">This link is valid for 30 minutes. If you did not request it, you can safely ignore this email.</p>`)
  }, `[وضع تجريبي - لا يوجد إعداد بريد] رابط استعادة كلمة المرور لـ ${to}: ${link}`);
}

module.exports = { sendVerificationEmail, sendPasswordResetEmail };
