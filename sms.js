function getTwilioClient() {
  if (!process.env.TWILIO_SID || !process.env.TWILIO_AUTH_TOKEN) return null;
  const twilio = require('twilio');
  return twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);
}

async function sendVerificationSms(to, code) {
  const client = getTwilioClient();
  if (!client) {
    console.log(`[وضع تجريبي - لا يوجد إعداد Twilio في .env] رمز التحقق لـ ${to}: ${code}`);
    return { simulated: true };
  }
  await client.messages.create({
    body: `رمز التحقق الخاص بك في صحنك: ${code}`,
    from: process.env.TWILIO_FROM,
    to
  });
  return { simulated: false };
}

module.exports = { sendVerificationSms };
