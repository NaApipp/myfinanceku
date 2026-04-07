import clientPromise from "./mongodb";

function formatDateWIB(date: Date) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = fmt.formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;

  return `${map.day}/${map.month}/${map.year} ${map.hour}:${map.minute}:${map.second}`;
}

export async function createTarget({
  userId,
  nama_target,
  tanggal_target,
  jumlah_target,
  idAccount,
  prioritas,
  description,
  idTarget,
}: {
  userId: string;
  nama_target: string;
  tanggal_target: string;
  jumlah_target: number;
  idAccount: string;
  prioritas: string;
  description?: string;
  idTarget: string;
}) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DATABASE);
  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      const account = await db.collection("account-card").findOne(
        {
          idAccount: idAccount,
          userId,
        },
        { session },
      );
      if (!account) {
        throw new Error("Account tidak ditemukan");
      }

      // Saldo akun tetap, tidak di-increment/decrement
      const currentBalance = Number(account.saldo_awal || 0);

      // Sinkronisasi: Set SEMUA target di akun yang sama ke saldo terbaru agar konsisten
      await db.collection("target").updateMany(
        { idAccount: idAccount, userId: userId },
        { $set: { target_now: currentBalance } },
        { session },
      );

      await db.collection("target").insertOne(
        {
          userId,
          idAccount: idAccount,
          idTarget,
          nama_target,
          tanggal_target,
          jumlah_target,
          target_now: currentBalance,
          prioritas,
          description,
          createdAt: formatDateWIB(new Date()),
        },
        { session },
      );
    });
    return { success: true };
  } catch (err: any) {
    console.error("Target Error:", err.message);
    return { success: false, message: err.message };
  } finally {
    await session.endSession();
  }
}


export async function deleteTarget({
  userId,
  idTarget,
}: {
  userId: string;
  idTarget: string;
}) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DATABASE);
  const session = client.startSession();
  try {
    await session.withTransaction(async () => {
      const target = await db.collection("target").findOne(
        {
          idTarget: idTarget,
          userId,
        },
        { session },
      );
      if (!target) {
        throw new Error("Target tidak ditemukan");
      }
      
      // Penghapusan target tidak memengaruhi saldo akun lagi
      await db.collection("target").deleteOne(
        { idTarget: target.idTarget },
        { session },
      );
    });
    return { success: true };
  } catch (err: any) {
    console.error("Delete Target Error:", err.message);
    return { success: false, message: err.message };
  } finally {
    await session.endSession();
  }
}
