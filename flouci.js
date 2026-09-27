// تكامل حقيقي مع بوابة الدفع التونسية Flouci
// التوثيق الرسمي: https://docs.flouci.com

const FLOUCI_BASE = 'https://developers.flouci.com/api/v2';

function authHeader() {
  return `Bearer ${process.env.FLOUCI_PUBLIC_KEY}:${process.env.FLOUCI_PRIVATE_KEY}`;
}

// ينشئ عملية دفع فعلية ويعيد رابط توجيه المستخدم لإتمام الدفع في صفحة Flouci
async function generatePayment({ amountMillimes, developerTrackingId, successLink, failLink, webhook, clientId }) {
  const res = await fetch(`${FLOUCI_BASE}/generate_payment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': authHeader() },
    body: JSON.stringify({
      amount: String(amountMillimes),
      developer_tracking_id: developerTrackingId,
      accept_card: true,
      success_link: successLink,
      fail_link: failLink,
      webhook,
      client_id: clientId
    })
  });
  const data = await res.json();
  if (!data.result || data.result.success !== true) {
    throw new Error((data.result && data.result.message) || 'فشل إنشاء عملية الدفع عبر Flouci');
  }
  return { paymentId: data.result.payment_id, link: data.result.link };
}

// يتحقق من الحالة الفعلية للدفع مباشرة من خوادم Flouci (المصدر الموثوق الوحيد للتأكيد)
async function verifyPayment(paymentId) {
  const res = await fetch(`${FLOUCI_BASE}/verify_payment/${paymentId}`, {
    headers: { 'Authorization': authHeader() }
  });
  const data = await res.json();
  if (!data.success) throw new Error('تعذّر التحقق من حالة الدفع عبر Flouci');
  return data.result; // { status: 'SUCCESS' | 'PENDING' | 'EXPIRED' | 'FAILURE', amount, details... }
}

module.exports = { generatePayment, verifyPayment };
