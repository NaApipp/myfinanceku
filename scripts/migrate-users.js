/**
 * Migration Script — MyFinanceKu
 * Nama file : scripts/migrate-users.js
 *
 * Tujuan:
 *   1. Normalisasi field `level` ke lowercase  (contoh: "Medium" → "medium")
 *   2. Backfill field `subscription` ke semua user yang belum memilikinya
 *
 * Jalankan SEKALI dengan perintah:
 *   node scripts/migrate-users.js
 *
 * Pastikan file .env.local sudah ada dan MONGODB_URI sudah diisi.
 */

const { MongoClient } = require("mongodb");
const path = require("path");

require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });

// ─── Config ───────────────────────────────────────────────────────────────────

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME     = process.env.MONGODB_DATABASE || "finance_ku"; // sesuaikan nama DB kamu

// ─── Helpers ──────────────────────────────────────────────────────────────────

function log(msg)            { console.log(`[${new Date().toISOString()}] ${msg}`); }
function logError(msg, err)  { console.error(`[${new Date().toISOString()}] ❌ ${msg}`, err?.message || err); }
function logSection(title)   { console.log(`\n${"─".repeat(50)}\n  ${title}\n${"─".repeat(50)}`); }

// ─── Main Migration ───────────────────────────────────────────────────────────

async function migrate() {
  if (!MONGODB_URI) {
    logError("MONGODB_URI tidak ditemukan di .env.local. Hentikan migrasi.");
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    log("✅ Terhubung ke MongoDB");

    const db       = client.db(DB_NAME);
    const usersCol = db.collection("users");

    // ════════════════════════════════════════════════════════════
    // TAHAP 1 — Normalisasi field `level` ke lowercase
    // Contoh: "Medium" → "medium", "Basic" → "basic"
    // ════════════════════════════════════════════════════════════
    logSection("TAHAP 1 — Normalisasi level ke lowercase");

    const totalLevelKapital = await usersCol.countDocuments({
      level: { $regex: /^[A-Z]/ }, // level yang diawali huruf kapital
    });

    if (totalLevelKapital === 0) {
      log("✅ Semua field level sudah lowercase. Lewati tahap ini.");
    } else {
      log(`📋 Ditemukan ${totalLevelKapital} user dengan level kapital...`);

      // Preview sebelum dieksekusi
      const previewKapital = await usersCol
        .find({ level: { $regex: /^[A-Z]/ } })
        .limit(5)
        .project({ _id: 1, email: 1, level: 1 })
        .toArray();

      log("👀 Preview 5 user pertama:");
      previewKapital.forEach((u, i) =>
        log(`   ${i + 1}. ${u.email} — level saat ini: "${u.level}"`)
      );

      // Jalankan normalisasi menggunakan aggregation pipeline
      const resultNormalize = await usersCol.updateMany(
        { level: { $exists: true } },
        [{ $set: { level: { $toLower: "$level" } } }] // "Medium" → "medium"
      );

      log(`✅ Normalisasi selesai! ${resultNormalize.modifiedCount} user diupdate.`);
    }

    // ════════════════════════════════════════════════════════════
    // TAHAP 2 — Backfill field `subscription`
    // Hanya untuk user yang belum punya field subscription
    // Level TIDAK diubah karena sudah ada di data existing
    // ════════════════════════════════════════════════════════════
    logSection("TAHAP 2 — Backfill field subscription");

    const totalBelumSubscription = await usersCol.countDocuments({
      subscription: { $exists: false },
    });

    if (totalBelumSubscription === 0) {
      log("✅ Semua user sudah punya field subscription. Lewati tahap ini.");
    } else {
      log(`📋 Ditemukan ${totalBelumSubscription} user yang belum punya subscription...`);

      // Preview sebelum dieksekusi
      const previewSub = await usersCol
        .find({ subscription: { $exists: false } })
        .limit(5)
        .project({ _id: 1, email: 1, level: 1 })
        .toArray();

      log("👀 Preview 5 user pertama:");
      previewSub.forEach((u, i) =>
        log(`   ${i + 1}. ${u.email} — level: "${u.level || "belum ada"}"`)
      );

      const now = new Date();

      const resultSub = await usersCol.updateMany(
        { subscription: { $exists: false } },
        {
          $set: {
            // ⚠️ level TIDAK diset di sini — sudah ada di data existing
            subscription: {
              status         : "inactive",
              plan           : "basic",      // default plan untuk user lama
              startDate      : now,
              expiredAt      : null,          // null = tidak ada expired (basic gratis)
              midtransOrderId: null,
            },
            updatedAt: now,
          },
        }
      );

      log(`✅ Backfill selesai! ${resultSub.modifiedCount} user berhasil diupdate.`);
    }

    // ════════════════════════════════════════════════════════════
    // TAHAP 3 — Verifikasi akhir & summary
    // ════════════════════════════════════════════════════════════
    logSection("TAHAP 3 — Verifikasi & Summary");

    const sisaBelumSub = await usersCol.countDocuments({
      subscription: { $exists: false },
    });
    const sisaKapital = await usersCol.countDocuments({
      level: { $regex: /^[A-Z]/ },
    });

    if (sisaBelumSub === 0 && sisaKapital === 0) {
      log("✅ Verifikasi berhasil: Semua data sudah bersih dan konsisten!");
    } else {
      if (sisaKapital > 0)  log(`⚠️  Masih ada ${sisaKapital} user dengan level kapital.`);
      if (sisaBelumSub > 0) log(`⚠️  Masih ada ${sisaBelumSub} user tanpa field subscription.`);
      log("   Coba jalankan script ini sekali lagi.");
    }

    // Distribusi level akhir
    const distribusi = await usersCol
      .aggregate([{ $group: { _id: "$level", count: { $sum: 1 } } }, { $sort: { _id: 1 } }])
      .toArray();

    log("\n📊 Distribusi level user setelah migrasi:");
    distribusi.forEach((l) => log(`   - ${l._id ?? "(null)"}: ${l.count} user`));

  } catch (err) {
    logError("Terjadi error saat migrasi:", err);
    process.exit(1);
  } finally {
    await client.close();
    log("\n🔌 Koneksi MongoDB ditutup.");
  }
}

migrate();