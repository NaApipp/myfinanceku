import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { jwtVerify } from "jose";

function generateId(prefix: string, userId: string) {
  const uniqueId = Math.random().toString(36).substring(2, 8).toUpperCase();
  const userSuffix = userId ? userId.slice(-4) : "0000";
  return `${prefix}-${userSuffix}-${uniqueId}`;
}

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId ? String(payload.userId) : null;

    if (!userId) {
      return NextResponse.json({ message: "Invalid user session" }, { status: 401 });
    }

    const {
      fromAccountId, // idAccount asal
      fromAccountName, // nama_asset asal
      toAccountId, // idAccount tujuan
      toAccountName, // nama_asset tujuan
      nominal,
      description,
      tanggal,
    } = await req.json();

    // --- Validasi ---
    if (fromAccountId === toAccountId)
      return NextResponse.json(
        { error: "Akun asal dan tujuan tidak boleh sama" },
        { status: 400 },
      );
    if (!nominal || nominal <= 0)
      return NextResponse.json(
        { error: "Nominal harus lebih dari 0" },
        { status: 400 },
      );

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const session = client.startSession();

    try {
      await session.withTransaction(async () => {
        const transferId = generateId("TRF", userId); // misal: "TRF-0002-XYZ123"
        const now = new Date(tanggal);

        // 1. Update balance akun asal (-nominal)
        await db
          .collection("account-card")
          .updateOne(
            { idAccount: fromAccountId, userId },
            { $inc: { saldo_awal: -nominal } },
            { session },
          );

        // Ambil saldo terbaru akun asal untuk sinkronisasi target
        const updatedAccountFrom = await db.collection("account-card").findOne(
          { idAccount: fromAccountId, userId },
          { session }
        );
        const currentBalanceFrom = Number(updatedAccountFrom?.saldo_awal || 0);

        // Sinkronisasi target akun asal
        await db.collection("target").updateMany(
          { idAccount: fromAccountId, userId },
          { $set: { target_now: currentBalanceFrom } },
          { session }
        );

        // 2. Update balance akun tujuan (+nominal)
        await db
          .collection("account-card")
          .updateOne(
            { idAccount: toAccountId, userId },
            { $inc: { saldo_awal: nominal } },
            { session },
          );

        // Ambil saldo terbaru akun tujuan untuk sinkronisasi target
        const updatedAccountTo = await db.collection("account-card").findOne(
          { idAccount: toAccountId, userId },
          { session }
        );
        const currentBalanceTo = Number(updatedAccountTo?.saldo_awal || 0);

        // Sinkronisasi target akun tujuan
        await db.collection("target").updateMany(
          { idAccount: toAccountId, userId },
          { $set: { target_now: currentBalanceTo } },
          { session }
        );

        // 3. Insert 2 transaksi sekaligus
        await db.collection("transaksi").insertMany(
          [
            {
              userId,
              idAccount: fromAccountId,
              nama_asset: fromAccountName,
              idTransaksi: generateId("TRX", userId),
              type_transaksi: "transfer",
              nominal_transaksi: nominal,
              tanggal_transaksi: tanggal,
              kategori: "Transfer",
              nama_kategori: "Transfer",
              description,
              createdAt: now.toISOString(),
              transferId,
              transferDirection: "out",
              transferAccountId: toAccountId,
            },
            {
              userId,
              idAccount: toAccountId,
              nama_asset: toAccountName,
              idTransaksi: generateId("TRX", userId),
              type_transaksi: "transfer",
              nominal_transaksi: nominal,
              tanggal_transaksi: tanggal,
              kategori: "Transfer",
              nama_kategori: "Transfer",
              description,
              createdAt: now.toISOString(),
              transferId,
              transferDirection: "in",
              transferAccountId: fromAccountId,
            },
          ],
          { session },
        );
      });

      return NextResponse.json({ success: true, message: "Transaksi berhasil disimpan!" });
    } catch (err: any) {
      return NextResponse.json({ error: err.message }, { status: 500 });
    } finally {
      await session.endSession();
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

