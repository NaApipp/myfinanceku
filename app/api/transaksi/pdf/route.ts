import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { jwtVerify } from "jose";
import { renderToBuffer } from "@react-pdf/renderer";
import { LaporanPDF } from "@/app/components/pdf/LaporanPdf";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate User
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_secret",
    );
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    // 2. Handle Date Range Filtering
    const { searchParams } = new URL(req.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    let startDate: string;
    let endDate: string =
      endDateParam || new Date().toISOString().split("T")[0];

    if (startDateParam) {
      startDate = startDateParam;
    } else {
      // Default: 30 days ago
      const date = new Date();
      date.setDate(date.getDate() - 30);
      startDate = date.toISOString().split("T")[0];
    }

    // 3. Fetch Data from MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const transaksiCollection = db.collection("transaksi");

    const query: any = {
      userId,
      tanggal_transaksi: { $gte: startDate, $lte: endDate },
    };

    const transaksi = await transaksiCollection
      .find(query)
      .sort({ tanggal_transaksi: -1 })
      .toArray();

    if (transaksi.length === 0) {
      return NextResponse.json(
        { message: "Tidak ada data transaksi pada periode ini." },
        { status: 404 },
      );
    }

    // 4. Calculate Summary
    const totalIncome = transaksi
      .filter((t) => t.type_transaksi === "pemasukan")
      .reduce((sum, t) => sum + Number(t.nominal_transaksi), 0);

    const totalExpense = transaksi
      .filter((t) => t.type_transaksi === "pengeluaran")
      .reduce((sum, t) => sum + Number(t.nominal_transaksi), 0);

    const balance = totalIncome - totalExpense;

    // 5. Format Helpers for the component
    const formatCurrency = (amount: number) => {
      return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0,
      }).format(amount);
    };

    const formatDate = (dateStr: string) => {
      return new Date(dateStr).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    };

    // Pre-format the data for the component
    const formattedTransaksi = transaksi.map((t) => ({
      ...t,
      tanggal_transaksi: formatDate(t.tanggal_transaksi),
      nominal_transaksi: `${t.type_transaksi === "pengeluaran" ? "-" : ""}${formatCurrency(Number(t.nominal_transaksi))}`,
    }));

    const formattedIncome = formatCurrency(totalIncome);
    const formattedExpense = formatCurrency(totalExpense);
    const formattedBalance = formatCurrency(balance);
    const formattedPeriod = `${formatDate(startDate)} - ${formatDate(endDate)}`;

    // 6. Generate PDF using react-pdf
    const pdfBuffer = await renderToBuffer(
      LaporanPDF({
        transaksi: formattedTransaksi,
        formattedIncome,
        formattedExpense,
        formattedBalance,
        formattedPeriod,
      })
    );

    // 7. Return PDF Response
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Laporan-Transaksi-${startDate}-ke-${endDate}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat membuat PDF: " + error.message },
      { status: 500 },
    );
  }
}
