import clientPromise from "@/app/lib/mongodb";


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

export async function createTransaction({
  userId,
  idAccount,
  idTransaksi,
  type_transaksi,
  nominal_transaksi,
  tanggal_transaksi,
  kategori,
  description,
}: {
  userId: string;
  idAccount: string;
  idTransaksi: string;
  type_transaksi: string;
  nominal_transaksi: number;
  tanggal_transaksi: string;
  kategori: string;
  description?: string;
}) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DATABASE);

  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      // Menggunakan koleksi 'account-card' sesuai dengan api/account-card/route.ts
      const account = await db.collection("account-card").findOne(
        {
          idAccount: idAccount,
          userId,
        },
        { session }
      );

      if (!account) {
        throw new Error("Account tidak ditemukan");
      }

      // validasi saldo
      const currentSaldo = Number(account.saldo_awal || 0);
      if (type_transaksi === "pengeluaran" && currentSaldo < nominal_transaksi) {
        throw new Error("Saldo tidak cukup");
      }

      const incValue =
        type_transaksi === "pemasukan" ? nominal_transaksi : -nominal_transaksi;

      // update saldo (menggunakan saldo_awal sebagai field saldo saat ini)
      await db.collection("account-card").updateOne(
        { _id: account._id },
        { $inc: { saldo_awal: incValue } },
        { session }
      );

      // Ambil saldo terbaru setelah transaksi untuk sinkronisasi mutlak
      const updatedAccount = await db.collection("account-card").findOne(
        { idAccount: idAccount, userId: userId },
        { session }
      );
      const currentBalance = Number(updatedAccount?.saldo_awal || 0);

      // Sinkronisasi: Set target_now dari SEMUA target di akun yang sama ke saldo terbaru
      await db.collection("target").updateMany(
        { idAccount: idAccount, userId: userId },
        { $set: { target_now: currentBalance } },
        { session }
      );

      // Ambil nama kategori untuk record permanen
      const categoryDoc = await db.collection("category").findOne(
        { idKategori: kategori, userId },
        { session }
      );

      // simpan transaksi
      await db.collection("transaksi").insertOne(
        {
          userId,
          idAccount: idAccount, // Simpan reference string ID
          nama_asset: `${account.nama_asset} - ${account.nama_akun}`, // Store name permanently
          idTransaksi,
          type_transaksi,
          nominal_transaksi,
          tanggal_transaksi,
          kategori,
          nama_kategori: categoryDoc?.nama_kategori || "Kategori Terhapus", // Store name permanently
          description,
          createdAt: formatDateWIB(new Date()),
        },
        { session }
      );

      // Jika pengeluaran, kurangi limit anggaran yang sesuai dengan kategori
      if (type_transaksi === "pengeluaran") {
        await db.collection("anggaran").updateMany(
          { userId, kategori_anggaran: kategori },
          { $inc: { limit_anggaran: -nominal_transaksi } },
          { session }
        );
      }
    });

    return { success: true };
  } catch (err: any) {
    console.error("Transaction Error:", err.message);
    return { success: false, message: err.message };
  } finally {
    await session.endSession();
  }
}


export async function deleteTransaction({
  userId,
  idTransaksi,
}: {
  userId: string;
  idTransaksi: string;
}) {
  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DATABASE);

  const session = client.startSession();

  try {
    await session.withTransaction(async () => {
      // 1. ambil transaksi
      const transaction = await db
        .collection("transaksi")
        .findOne(
          {
            idTransaksi: idTransaksi,
            userId,
          },
          { session }
        );

      if (!transaction) {
        throw new Error("Transaksi tidak ditemukan");
      }

      // 2. tentukan pembalikan saldo
      const reverseValue =
        transaction.type_transaksi === "pemasukan"
          ? -transaction.nominal_transaksi
          : transaction.nominal_transaksi;

      // 3. Update saldo account
      await db.collection("account-card").updateOne(
        { idAccount: transaction.idAccount },
        { $inc: { saldo_awal: reverseValue } },
        { session }
      );

      // Ambil saldo terbaru untuk sinkronisasi mutlak
      const updatedAccount = await db.collection("account-card").findOne(
        { idAccount: transaction.idAccount, userId: userId },
        { session }
      );
      const currentBalance = Number(updatedAccount?.saldo_awal || 0);

      // Sinkronisasi: Set target_now dari SEMUA target di akun yang sama ke saldo terbaru
      await db.collection("target").updateMany(
        { idAccount: transaction.idAccount, userId: userId },
        { $set: { target_now: currentBalance } },
        { session }
      );

      // 4. Delete transaksi
      await db.collection("transaksi").deleteOne(
        { idTransaksi: transaction.idTransaksi },
        { session }
      );

      // Jika pengeluaran, kembalikan limit anggaran yang sesuai dengan kategori
      if (transaction.type_transaksi === "pengeluaran") {
        await db.collection("anggaran").updateMany(
          { userId, kategori_anggaran: transaction.kategori },
          { $inc: { limit_anggaran: transaction.nominal_transaksi } },
          { session }
        );
      }
    });

    return { success: true };
  } catch (err: any) {
    console.error("Delete Transaction Error:", err.message);
    return { success: false, message: err.message };
  } finally {
    await session.endSession();
  }
}