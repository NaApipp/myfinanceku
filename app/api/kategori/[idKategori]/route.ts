import { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { jwtVerify } from "jose";

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