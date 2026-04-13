import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { jwtVerify } from "jose";
import z from "zod";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_secret",
    );
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId ? String(payload.userId) : null;

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid user session" },
        { status: 401 },
      );
    }

    const body = await req.json();

    const registerSchema = z.object({
      type_asset: z.string().min(1, "Tipe asset wajib diisi"),
      nama_asset: z.string().min(1, "Nama asset wajib diisi"),
      saldo_awal: z.coerce
        .number()
        .positive("Saldo tidak boleh negatif")
        .min(1, "Saldo awal wajib diisi"),

      nama_akun: z.string(),
    });

    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 },
      );
    }

    const { type_asset, nama_asset, saldo_awal, nama_akun } = validation.data;

    // Mengambil instance client dari shared koneksi MongoDB (reusable connection)
    const client = await clientPromise;
    // Menghubungkan ke database sesuai konfigurasi di environment variable (.env)
    const db = client.db(process.env.MONGODB_DATABASE);
    // Menentukan koleksi "transaksi" yang akan digunakan untuk operasi data
    const transaksiCollection = db.collection("account-card");
    // Generate unique ID using random string to avoid collisions if accounts are deleted
    const uniqueId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const idAccount = `ACC_CARD-${userId.slice(-4)}-${uniqueId}`;

    // Insert data transaksi
    const transaksi = await transaksiCollection.insertOne({
      userId: String(userId),
      idAccount: String(idAccount),
      type_asset,
      nama_asset,
      saldo_awal,
      nama_akun,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Account dan Card berhasil ditambahkan",
        data: {
          idAccount,
          type_asset,
          nama_asset,
          saldo_awal,
          nama_akun,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error processing account card:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat memproses account card",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_secret",
    );
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    // Mengambil instance client MongoDB
    const client = await clientPromise;
    // Menghubungkan ke database
    const db = client.db(process.env.MONGODB_DATABASE);
    // Mengakses koleksi "transaksi"
    const transaksiCollection = db.collection("account-card");
    const transaksi = await transaksiCollection.find({ userId }).toArray();
    return NextResponse.json(
      {
        success: true,
        message: "Data Transaksi berhasil diambil",
        data: transaksi,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing transaksi:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat memproses transaksi" },
      { status: 500 },
    );
  }
}
