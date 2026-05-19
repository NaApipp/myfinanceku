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
    const startOfMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`;
    const endOfMonthDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const endOfMonth = `${endOfMonthDate.getFullYear()}-${String(endOfMonthDate.getMonth() + 1).padStart(2, "0")}-${String(endOfMonthDate.getDate()).padStart(2, "0")}`;

    // 1. Kategori Terboros (Top 1 Category)
    const topCategoryResult = await db.collection("transaksi").aggregate([
      {
        $match: {
          userId: userId,
          type_transaksi: "pengeluaran",
          tanggal_transaksi: { $gte: startOfMonth, $lte: endOfMonth },
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
      { $sort: { total: -1 } },
      { $limit: 1 }
    ]).toArray();

    const topCategory = topCategoryResult.length > 0 ? {
      name: topCategoryResult[0].categoryInfo?.nama_kategori || topCategoryResult[0]._id || "Lainnya",
      total: topCategoryResult[0].total
    } : null;

    // 2. Transaksi Terbesar (Largest Single Transaction)
    const largestTransactionResult = await db.collection("transaksi").find({
      userId: userId,
      type_transaksi: "pengeluaran",
      tanggal_transaksi: { $gte: startOfMonth, $lte: endOfMonth }
    }).sort({ nominal_transaksi: -1 }).limit(1).toArray();

    // To get category name for the largest transaction
    let largestTransaction = null;
    if (largestTransactionResult.length > 0) {
      const tx = largestTransactionResult[0];
      let catName = tx.kategori;
      if (tx.kategori.startsWith("KTGR")) {
        const catDoc = await db.collection("category").findOne({ idKategori: tx.kategori });
        if (catDoc) catName = catDoc.nama_kategori;
      }
      largestTransaction = {
        name: tx.description || catName,
        category: catName,
        date: tx.tanggal_transaksi, // Format YYYY-MM-DD
        amount: tx.nominal_transaksi
      };
    }

    // 3. Hari Paling Boros (Expenses grouped by day of week)
    // In JS, 0 = Sunday, 1 = Monday. We want 1=Senin ... 7=Minggu.
    // MongoDB doesn't easily do dayOfWeek on YYYY-MM-DD strings without parsing them.
    // So we just fetch all expenses for the month and aggregate in JS.
    const allExpenses = await db.collection("transaksi").find({
      userId: userId,
      type_transaksi: "pengeluaran",
      tanggal_transaksi: { $gte: startOfMonth, $lte: endOfMonth }
    }).toArray();

    const dayTotals = [0, 0, 0, 0, 0, 0, 0]; // Mon, Tue, Wed, Thu, Fri, Sat, Sun
    
    allExpenses.forEach(tx => {
      // tx.tanggal_transaksi is "YYYY-MM-DD" or similar
      const d = new Date(tx.tanggal_transaksi);
      // getDay() is 0 for Sun, 1 for Mon
      let dayIndex = d.getDay() - 1;
      if (dayIndex === -1) dayIndex = 6; // Sunday becomes 6
      dayTotals[dayIndex] += tx.nominal_transaksi;
    });

    return NextResponse.json({
      success: true,
      data: {
        topCategory,
        largestTransaction,
        dayTotals
      },
    });
  } catch (error: any) {
    console.error("Error in statistic-widgets:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}
