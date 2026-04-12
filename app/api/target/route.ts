import { NextRequest, NextResponse } from "next/server";
import { createTarget } from "@/app/lib/targetService";
import { jwtVerify } from "jose";
import clientPromise from "@/app/lib/mongodb";
import { z } from "zod";

// ✅ Schema validasi (FIXED)
const targetSchema = z.object({
  nama_target: z
    .string()
    .trim()
    .min(3, "Nama target minimal 3 karakter")
    .max(100, "Nama target maksimal 100 karakter"),

  tanggal_target: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "Format tanggal tidak valid",
    }),

  // ✅ FIX: convert ke number + validasi > 0
  jumlah_target: z
    .coerce.number({
      message: "Jumlah target harus berupa angka",
    })
    .positive("Jumlah target harus lebih dari 0"),

  idAccount: z.string().min(1, "Account wajib diisi"),

  // ✅ FIX: enum biar konsisten
  prioritas: z.string().min(1, "Prioritas wajib diisi"),

  description: z
    .string()
    .max(255, "Deskripsi maksimal 255 karakter")
    .optional(),
});

export async function POST(req: NextRequest) {
  try {
    // 🔐 AUTH
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_secret"
    );

    const { payload } = await jwtVerify(token, secret);

    if (!payload || !payload.userId) {
      return NextResponse.json(
        { message: "Invalid user session" },
        { status: 401 }
      );
    }

    const userId = String(payload.userId);

    // 🧪 VALIDASI BODY
    const body = await req.json();
    const result = targetSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: result.error.issues[0].message,
        },
        { status: 400 }
      );
    }

    const {
      nama_target,
      tanggal_target,
      jumlah_target,
      idAccount,
      prioritas,
      description,
    } = result.data;

    // 🆔 Generate ID
    const uniqueId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const idTarget = `TRGT-${userId.slice(-4)}-${uniqueId}`;

    // 🚀 CREATE
    const createResult = await createTarget({
      userId,
      idTarget,
      nama_target,
      tanggal_target, // kalau mau next level: new Date(tanggal_target)
      jumlah_target, // sudah number
      idAccount,
      prioritas,
      description,
    });

    if (!createResult.success) {
      return NextResponse.json(
        { success: false, message: createResult.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Berhasil" },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("Error processing target:", err);
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    // 🔐 AUTH
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_secret"
    );

    const { payload } = await jwtVerify(token, secret);

    if (!payload || !payload.userId) {
      return NextResponse.json(
        { message: "Invalid user session" },
        { status: 401 }
      );
    }

    const userId = String(payload.userId);

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);

    const targets = await db.collection("target").find({ userId }).toArray();

    return NextResponse.json(
      {
        success: true,
        data: targets,
      },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error processing target:", err);
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}