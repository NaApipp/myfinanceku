import clientPromise from "@/app/lib/mongodb";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ idUser: string }> },
) {
  try {
    const { idUser } = await params;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const usersCollection = db.collection("users_admin");
    
    const result = await usersCollection.deleteOne({ idUser });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Data tidak ditemukan" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Data User Admin berhasil dihapus",
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