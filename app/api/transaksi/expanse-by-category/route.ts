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

    const expanseByCategory = await db
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
            _id: "$kategori",
            total: { $sum: "$nominal_transaksi" },
          },
        },
        {
          $lookup: {
            from: "category",
            localField: "_id",
            foreignField: "idKategori",
            as: "categoryInfo",
          },
        },
        {
          $unwind: {
            path: "$categoryInfo",
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $sort: { total: -1 }
        }
      ])
      .toArray();

    const formattedData = expanseByCategory.map(item => ({
      kategori: item.categoryInfo?.nama_kategori || item._id || "Lainnya",
      total: item.total
    }));

    return NextResponse.json({
      success: true,
      data: formattedData,
    });
  } catch (error: any) {
    console.error("Error in expanse-by-category:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
