import clientPromise from "@/app/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);

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

    const now = new Date();

    // awal bulan (YYYY-MM-DD)
    const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;

    // akhir bulan (YYYY-MM-DD)
    const endOfMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const endOfMonth = `${endOfMonthDate.getFullYear()}-${String(endOfMonthDate.getMonth() + 1).padStart(2, "0")}-${String(endOfMonthDate.getDate()).padStart(2, "0")}`;

    const totalIncome = await db
      .collection("transaksi")
      .aggregate([
        {
          $match: {
            userId: userId,
            type_transaksi: "pengeluaran",
            tanggal_transaksi: {
              $gte: startOfMonth,
              $lte: endOfMonth,
            },
          },
        },
        {
          $group: {
            _id: null,
            totalExpense: { $sum: "$nominal_transaksi" },
          },
        },
      ])
      .toArray();

    const totalExpense = totalIncome.length > 0 ? totalIncome[0].totalExpense : 0;

    return NextResponse.json({
      success: true,
      data: [{ totalExpense: totalExpense }],
    });
  } catch (error: any) {
    console.error("Error in total-expanse:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
