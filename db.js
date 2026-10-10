// طبقة التخزين: PostgreSQL دائمة عند ضبط DATABASE_URL، وإلا ملف db.json محلي (مؤقت على الاستضافات المجانية).
// تُحمَّل البيانات كلها في الذاكرة عند التشغيل، وكل writeDB يحفظ نسخة كاملة في القاعدة بشكل متسلسل.
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'db.json');
const defaults = () => ({ users: [], restaurants: [], pendingCodes: [], paymentClaims: [], passwordResets: [] });

let cache = null;
let pool = null;
let inFlight = false;
let pending = false;
let idleWaiters = [];

async function initDB() {
  const url = process.env.DATABASE_URL;
  if (url) {
    const { Pool } = require('pg');
    const local = /localhost|127\.0\.0\.1/.test(url);
    // Neon يضيف channel_binding=require إلى الرابط، ومكتبة pg لا تدعمه، فنحذفه (الاتصال يبقى مشفّرًا عبر sslmode)
    let connectionString = url.trim();
    try { const u = new URL(connectionString); u.searchParams.delete('channel_binding'); connectionString = u.toString(); } catch (e) { /* نستخدم الرابط كما هو */ }
    pool = new Pool({ connectionString, ssl: local ? false : { rejectUnauthorized: false }, max: 3 });
    await pool.query('CREATE TABLE IF NOT EXISTS kv (key text PRIMARY KEY, value jsonb NOT NULL)');
    const r = await pool.query("SELECT value FROM kv WHERE key = 'main'");
    if (r.rows.length) {
      cache = Object.assign(defaults(), r.rows[0].value);
    } else {
      cache = defaults();
      await pool.query("INSERT INTO kv (key, value) VALUES ('main', $1::jsonb)", [JSON.stringify(cache)]);
    }
    console.log(`✅ قاعدة البيانات: PostgreSQL دائمة (${cache.users.length} مستخدم محفوظ)`);
  } else {
    cache = fs.existsSync(DB_PATH) ? Object.assign(defaults(), JSON.parse(fs.readFileSync(DB_PATH, 'utf8'))) : defaults();
    console.warn('⚠️  DATABASE_URL غير مضبوط: البيانات تُحفظ في db.json فقط، وهي تُمسح عند كل إعادة تشغيل على Render المجاني!');
  }
}

function readDB() {
  if (!cache) throw new Error('قاعدة البيانات لم تُهيّأ بعد (initDB)');
  return cache;
}

function writeDB(data) {
  cache = data;
  if (pool) persist();
  else {
    try { fs.writeFileSync(DB_PATH, JSON.stringify(cache, null, 2)); } catch (e) { console.error('فشل كتابة db.json:', e.message); }
  }
}

// حفظ متسلسل: إن كان هناك حفظ جارٍ نؤجّل الجديد ونحفظ آخر نسخة مرة واحدة بعد انتهائه
async function persist() {
  if (inFlight) { pending = true; return; }
  inFlight = true;
  try {
    await pool.query("UPDATE kv SET value = $1::jsonb WHERE key = 'main'", [JSON.stringify(cache)]);
  } catch (e) {
    console.error('❌ فشل حفظ قاعدة البيانات:', e.message);
  }
  inFlight = false;
  if (pending) { pending = false; persist(); }
  else { idleWaiters.forEach(r => r()); idleWaiters = []; }
}

// ينتظر انتهاء أي حفظ جارٍ (يُستدعى قبل إيقاف الخادم)
function flush() {
  if (!pool || (!inFlight && !pending)) return Promise.resolve();
  return new Promise(res => idleWaiters.push(res));
}

module.exports = { initDB, readDB, writeDB, flush };
