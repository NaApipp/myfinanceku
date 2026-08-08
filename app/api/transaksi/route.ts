import { withCors, handleOptions } from "@/app/lib/cors";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { jwtVerify } from "jose";
import { createTransaction } from "@/app/lib/transactionService";
import { z } from "zod";

const transaksiSchema = z.object({
  type_transaksi: z.string().min(1, "Tipe transaksi wajib diisi"),
  nominal_transaksi: z.coerce
    .number({ message: "Nominal harus berupa angka" })
    .positive("Nominal harus lebih dari 0"),
  tanggal_transaksi: z.string().min(1, "Tanggal transaksi wajib diisi"),
  kategori: z.string().min(1, "Kategori wajib diisi"),
  sumberdana: z.string().min(1, "Sumber dana wajib diisi"),
  description: z.string().optional().or(z.literal("")),
});

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

export async function POST(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const transaksiCollection = db.collection("transaksi");

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return withCors(NextResponse.json({ message: "Unauthorized" }, { status: 401 }), req);
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId ? String(payload.userId) : null;

    if (!userId) {
      return withCors(NextResponse.json({ message: "Invalid user session" }, { status: 401 }), req);
    }

    // Generate unique ID using random string to avoid collisions if transactions are deleted
    const uniqueId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const idTransaksi = `TRX-${userId.slice(-4)}-${uniqueId}`;
    
    const body = await req.json();
    const validation = transaksiSchema.safeParse(body);

    if (!validation.success) {
      return withCors(NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 }
      ), req);
    }

    const {
      type_transaksi,
      nominal_transaksi,
      tanggal_transaksi,
      kategori,
      sumberdana: idAccount,
      description,
    } = validation.data;

    const result = await createTransaction({
      userId,
      idAccount: idAccount as string,
      idTransaksi,
      type_transaksi,
      nominal_transaksi,
      tanggal_transaksi,
      kategori,
      description,
    });

    if (!result.success) {
      return withCors(NextResponse.json(
        { message: result.message },
        { status: 400 }
      ), req);
    }

    return withCors(NextResponse.json({ success: true, message: "Berhasil" }), req);
  } catch (err: any) {
    console.error("Error processing transaksi:", err);
    return withCors(NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    ), req);
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return withCors(NextResponse.json({ message: "Unauthorized" }, { status: 401 }), req);
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_secret",
    );
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    // Ambil query parameters untuk pagination dan filter
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const typeTransaksi = searchParams.get("typeTransaksi");
    const sumberDana = searchParams.get("sumberDana");
    const minNominal = searchParams.get("minNominal");
    const maxNominal = searchParams.get("maxNominal");
    const skip = (page - 1) * limit;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const transaksiCollection = db.collection("transaksi");

    // Bangun query filter
    const query: any = { userId };
    
    if (startDate || endDate) {
      query.tanggal_transaksi = {};
      if (startDate) {
        query.tanggal_transaksi.$gte = startDate;
      }
      if (endDate) {
        query.tanggal_transaksi.$lte = endDate;
      }
    }

    if (typeTransaksi) {
      query.type_transaksi = typeTransaksi;
    }

    if (sumberDana) {
      query.idAccount = sumberDana;
    }

    if (minNominal || maxNominal) {
      query.$expr = { $and: [] };
      if (minNominal) {
        query.$expr.$and.push({
          $gte: [{ $toDouble: "$nominal_transaksi" }, Number(minNominal)]
        });
      }
      if (maxNominal) {
        query.$expr.$and.push({
          $lte: [{ $toDouble: "$nominal_transaksi" }, Number(maxNominal)]
        });
      }
    }

    // Hitung total data untuk pagination sesuai filter
    const totalItems = await transaksiCollection.countDocuments(query);
    const totalPages = Math.ceil(totalItems / limit);

    // Ambil data dengan sorting, skip, limit, dan filter
    const transaksi = await transaksiCollection
      .find(query)
      .sort({ tanggal_transaksi: -1 }) // Terbaru dulu
      .skip(skip)
      .limit(limit)
      .toArray();

    return withCors(NextResponse.json(
      {
        success: true,
        message: "Data Transaksi berhasil diambil",
        data: transaksi,
        pagination: {
          currentPage: page,
          totalPages,
          totalItems,
          limit,
        },
      },
      { status: 200 },
    ), req);
  } catch (error) {
    console.error("Error processing transaksi:", error);
    return withCors(NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat memproses transaksi" },
      { status: 500 },
    ), req);
  }
}
export const OPTIONS = handleOptions;
