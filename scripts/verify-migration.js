/**
 * Verify Script — MyFinanceKu
 * Nama file : scripts/verify-migration.js
 *
 * Tujuan : Mengecek kondisi data user di MongoDB TANPA mengubah apapun.
 *          Gunakan SEBELUM dan SESUDAH menjalankan migrate-users.js
 *
 * Jalankan dengan:
 *   node scripts/verify-migration.js
 */

const { MongoClient } = require("mongodb");
const path = require("path");

require("dotenv").config({ path: path.resolve(process.cwd(), ".env") });

const MONGODB_URI = process.env.MONGODB_URI;
const DB_NAME     = process.env.MONGODB_DATABASE || "finance_ku";

async function verify() {
  if (!MONGODB_URI) {
    console.error("MONGODB_URI tidak ditemukan di .env");
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI);

  try {
    await client.connect();

    const db       = client.db(DB_NAME);
    const usersCol = db.collection("users");

    const total          = await usersCol.countDocuments();
    const punyaLevel     = await usersCol.countDocuments({ level: { $exists: true } });
    const tidakPunyaLevel= await usersCol.countDocuments({ level: { $exists: false } });
    const levelKapital   = await usersCol.countDocuments({ level: { $regex: /^[A-Z]/ } });
    const punyaSub       = await usersCol.countDocuments({ subscription: { $exists: true } });
    const tidakPunyaSub  = await usersCol.countDocuments({ subscription: { $exists: false } });
    const subActive      = await usersCol.countDocuments({ "subscription.status": "active" });
    const subInactive    = await usersCol.countDocuments({ "subscription.status": "inactive" });

    const distribusi = await usersCol
      .aggregate([{ $group: { _id: "$level", count: { $sum: 1 } } }, { $sort: { _id: 1 } }])
      .toArray();

    console.log("\n══════════════════════════════════════════════");
    console.log("        HASIL VERIFIKASI MIGRASI              ");
    console.log("══════════════════════════════════════════════");
    console.log(`  Total user                : ${total}`);
    console.log("──────────────────────────────────────────────");
    console.log(`  Punya field level         : ${punyaLevel}`);
    console.log(`  Tidak punya field level   : ${tidakPunyaLevel}  ${tidakPunyaLevel > 0 ? "⚠️" : "✅"}`);
    console.log(`  Level masih kapital       : ${levelKapital}  ${levelKapital > 0 ? "⚠️  (perlu dinormalisasi)" : "✅"}`);
    console.log("──────────────────────────────────────────────");
    console.log(`  Punya field subscription  : ${punyaSub}`);
    console.log(`  Tidak punya subscription  : ${tidakPunyaSub}  ${tidakPunyaSub > 0 ? "⚠️" : "✅"}`);
    console.log(`  Subscription active       : ${subActive}`);
    console.log(`  Subscription inactive     : ${subInactive}`);
    console.log("──────────────────────────────────────────────");
    console.log("  Distribusi level:");
    distribusi.forEach((l) =>
      console.log(`    - ${(l._id ?? "(null)").padEnd(12)}: ${l.count} user`)
    );
    console.log("══════════════════════════════════════════════\n");

    // Kesimpulan
    const siapMigrasi = tidakPunyaLevel === 0 && tidakPunyaSub === 0 && levelKapital === 0;
    if (siapMigrasi) {
      console.log("✅ Data sudah bersih dan siap. Tidak perlu migrasi.\n");
    } else {
      console.log("⚠️  Ada data yang perlu dimigrasi. Jalankan:");
      console.log("   node scripts/migrate-users.js\n");
    }

  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  } finally {
    await client.close();
  }
}

verify();