import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { jwtVerify } from "jose";
import z from "zod";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ idKategori: string }> },
) {
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

    const { idKategori } = await params;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const transaksiCollection = db.collection("category");
    
    const result = await transaksiCollection.deleteOne({ idKategori, userId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan atau Anda tidak memiliki akses" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Data Kategori berhasil dihapus",
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing account deletion:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat memproses penghapusan" },
      { status: 500 },
    );
  }
}

// Schema body
const kategoriSchema = z.object({
  nama_kategori: z
    .string()
    .min(3, "Nama kategori minimal 3 karakter")
    .max(50, "Nama kategori maksimal 50 karakter")
    .trim(),
});

// Schema params
const paramsSchema = z.object({
  idKategori: z.string().min(1, "ID kategori tidak valid"),
});

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ idKategori: string }> },
) {
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

    // ✅ VALIDASI PARAMS
    const parsedParams = paramsSchema.safeParse(await params);
    if (!parsedParams.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsedParams.error.issues[0].message,
        },
        { status: 400 }
      );
    }

    const { idKategori } = parsedParams.data;

    // ✅ VALIDASI BODY
    const body = await req.json();
    const parsedBody = kategoriSchema.safeParse(body);

    if (!parsedBody.success) {
      return NextResponse.json(
        {
          success: false,
          message: parsedBody.error.issues[0].message,
        },
        { status: 400 }
      );
    }

    const { nama_kategori } = parsedBody.data;

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const categoryCollection = db.collection("category");

    // 🚫 Cek duplikasi (optional tapi recommended)
    const existing = await categoryCollection.findOne({
      userId,
      nama_kategori,
      idKategori: { $ne: idKategori }, // exclude current
    });

    if (existing) {
      return NextResponse.json(
        { success: false, message: "Kategori sudah digunakan" },
        { status: 409 }
      );
    }

    // 🔄 UPDATE
    const result = await categoryCollection.updateOne(
      { idKategori, userId },
      { $set: { nama_kategori } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Data tidak ditemukan atau Anda tidak memiliki akses",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Data Kategori berhasil diperbarui",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing category update:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat memproses pembaruan",
      },
      { status: 500 }
    );
  }
}