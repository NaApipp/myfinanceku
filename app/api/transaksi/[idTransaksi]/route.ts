import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ idTransaksi: string }> },
) {
  try {
    const { idTransaksi } = await params;
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const transaksiCollection = db.collection("transaksi");
    const transaksi = await transaksiCollection.deleteOne({ idTransaksi });
    return NextResponse.json(
      {
        success: true,
        message: "Data Transaksi berhasil dihapus",
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
