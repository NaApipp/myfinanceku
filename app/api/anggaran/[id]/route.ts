import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import clientPromise from "@/app/lib/mongodb";
import z from "zod";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
    const { payload } = await jwtVerify(token, secret);
    const userId = String(payload.userId);

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const anggaranCollection = db.collection("anggaran");

    const result = await anggaranCollection.deleteOne({
      idAnggaran: id,
      userId: userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Anggaran tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Anggaran berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting anggaran:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
    const { payload } = await jwtVerify(token, secret);
    const userId = String(payload.userId);

    const body = await req.json();

    const anggaranSchema = z.object({
      nama_anggaran: z.string().min(1, "Nama anggaran wajib diisi"),
      kategori_anggaran: z.string().min(1, "Kategori anggaran wajib diisi"),
      limit_anggaran: z.coerce
        .number()
        .positive("Limit anggaran tidak boleh negatif")
        .min(1, "Limit anggaran wajib diisi"),
      periode_anggaran: z.string().min(1, "Periode anggaran wajib diisi").refine((val) => {
        const input = new Date(val);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return input >= today;
      }, { message: "Periode anggaran tidak boleh kurang dari hari ini" }),
    });

    const validation = anggaranSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.issues[0].message },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const anggaranCollection = db.collection("anggaran");

    const result = await anggaranCollection.updateOne(
      { idAnggaran: id, userId: userId },
      { $set: validation.data }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Anggaran tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Anggaran berhasil diupdate",
    });
  } catch (error) {
    console.error("Error updating anggaran:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
