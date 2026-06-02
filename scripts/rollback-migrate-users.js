/**
 * Rollback Script — MyFinanceKu
 * Nama file : scripts/rollback-migrate-users.js
 *
 * Tujuan : Mengembalikan perubahan dari migrate-users.js jika terjadi masalah.
 *
 * Yang di-rollback:
 *   - Menghapus field `subscription` dari semua user basic inactive
 *   - TIDAK menyentuh user yang sudah upgrade (medium/advanced)
 *   - TIDAK mengembalikan kapitalisasi level (karena lowercase lebih benar)
 *
 * ⚠️  PERINGATAN: Jalankan HANYA jika migrasi bermasalah!
 *
 * Jalankan dengan:
 *   node scripts/rollback-migrate-users.js
 */

const { MongoClient } = require("mongodb");
const path = require("path");
const readline = require("readline");

require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME     = process.env.MONGODB_DATABASE || "finance_ku";

function log(msg) { console.log(`[${new Date().toISOString()}] ${msg}`); }

function confirm(question) {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => { rl.close(); resolve(answer.trim().toLowerCase()); });
  });
}

async function rollback() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI tidak ditemukan.");
    process.exit(1);
  }

  console.log("\n⚠️  ROLLBACK SCRIPT — MyFinanceKu");
  console.log("   Ini akan menghapus field subscription dari user basic inactive.");
  console.log("   User yang sudah upgrade (medium/advanced) TIDAK akan tersentuh.\n");

  const answer = await confirm("Ketik 'ya' untuk melanjutkan rollback: ");
  if (answer !== "ya") {
    log("Rollback dibatalkan.");
    process.exit(0);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();
    log("✅ Terhubung ke MongoDB");

    const db       = client.db(DB_NAME);
    const usersCol = db.collection("users");

    // Preview sebelum rollback
    const totalTerdampak = await usersCol.countDocuments({
      level: "basic",
      "subscription.status": "inactive",
      "subscription.midtransOrderId": null,
    });

    log(`📋 ${totalTerdampak} user akan di-rollback...`);

    const result = await usersCol.updateMany(
      {
        level: "basic",
        "subscription.status": "inactive",
        "subscription.midtransOrderId": null, // hanya hasil migrasi otomatis
      },
      { $unset: { subscription: "" } }
    );

    log(`✅ Rollback selesai. ${result.modifiedCount} user dikembalikan.`);

  } catch (err) {
    console.error("Error saat rollback:", err);
    process.exit(1);
  } finally {
    await client.close();
    log("🔌 Koneksi MongoDB ditutup.");
  }
}

rollback();