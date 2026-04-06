import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { jwtVerify } from "jose";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ idAccount: string }> },
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

    const { idAccount } = await params;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const transaksiCollection = db.collection("account-card");
    
    const result = await transaksiCollection.deleteOne({ idAccount, userId });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan atau Anda tidak memiliki akses" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Data Akun/Kartu berhasil dihapus",
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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ idAccount: string }> },
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

    const { idAccount } = await params;
    const body = await req.json();
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const transaksiCollection = db.collection("account-card");
    
    // Hapus _id dari body jika ada untuk menghindari error saat update
    const { _id, ...updateData } = body;

    const result = await transaksiCollection.updateOne(
      { idAccount, userId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan atau Anda tidak memiliki akses" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Data Akun/Kartu berhasil diupdate",
        data: result,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing account update:", error);
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan saat memproses update" },
      { status: 500 },
    );
  }
}