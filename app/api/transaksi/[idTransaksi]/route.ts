import { deleteTransaction } from "@/app/lib/transactionService";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ idTransaksi: string }> }
) {
  try {
    const { idTransaksi } = await params;

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

    const result = await deleteTransaction({
      idTransaksi: idTransaksi,
      userId,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: "Berhasil dihapus" });
  } catch (err: any) {
    console.error("Error processing transaksi delete:", err);
    return NextResponse.json(
      { success: false, message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}