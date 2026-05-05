import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { jwtVerify } from "jose";
import puppeteer from "puppeteer";

export async function GET(req: NextRequest) {
  try {
    // 1. Authenticate User
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_secret"
    );
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId as string;

    // 2. Handle Date Range Filtering
    const { searchParams } = new URL(req.url);
    const startDateParam = searchParams.get("startDate");
    const endDateParam = searchParams.get("endDate");

    let startDate: string;
    let endDate: string = endDateParam || new Date().toISOString().split("T")[0];

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
      tanggal_transaksi: { $gte: startDate, $lte: endDate }
    };

    const transaksi = await transaksiCollection
      .find(query)
      .sort({ tanggal_transaksi: -1 })
      .toArray();

    if (transaksi.length === 0) {
      return NextResponse.json(
        { message: "Tidak ada data transaksi pada periode ini." },
        { status: 404 }
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

    // 5. Format Helpers
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

    // 6. Generate HTML Template
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          body { 
            font-family: 'Inter', sans-serif; 
            color: #1f2937; 
            line-height: 1.5;
            margin: 0;
            padding: 40px;
          }
          .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 2px solid #e5e7eb;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .logo {
            font-size: 24px;
            font-weight: 700;
            color: #2563eb;
          }
          .report-info {
            text-align: right;
          }
          .report-title {
            font-size: 20px;
            font-weight: 700;
            margin-bottom: 4px;
          }
          .period {
            color: #6b7280;
            font-size: 14px;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
            margin-bottom: 40px;
          }
          .summary-card {
            background: #f9fafb;
            padding: 16px;
            border-radius: 8px;
            border: 1px solid #f3f4f6;
          }
          .summary-label {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            margin-bottom: 4px;
          }
          .summary-value {
            font-size: 18px;
            font-weight: 600;
          }
          .income { color: #059669; }
          .expense { color: #dc2626; }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 40px;
          }
          th {
            background: #f8fafc;
            text-align: left;
            padding: 12px 8px;
            border-bottom: 2px solid #e5e7eb;
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            color: #4b5563;
          }
          td {
            padding: 12px 8px;
            border-bottom: 1px solid #f3f4f6;
            font-size: 13px;
          }
          .type-badge {
            padding: 2px 8px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 600;
            text-transform: capitalize;
          }
          .type-pemasukan { background: #d1fae5; color: #065f46; }
          .type-pengeluaran { background: #fee2e2; color: #991b1b; }
          
          .footer {
            text-align: center;
            font-size: 12px;
            color: #9ca3af;
            margin-top: 60px;
          }
          .nominal { font-weight: 600; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">MyFinanceKu</div>
          <div class="report-info">
            <div class="report-title">Laporan Transaksi</div>
            <div class="period">${formatDate(startDate)} - ${formatDate(endDate)}</div>
          </div>
        </div>

        <div class="summary-grid">
          <div class="summary-card">
            <div class="summary-label">Total Pemasukan</div>
            <div class="summary-value income">${formatCurrency(totalIncome)}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Total Pengeluaran</div>
            <div class="summary-value expense">${formatCurrency(totalExpense)}</div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Saldo Akhir</div>
            <div class="summary-value">${formatCurrency(balance)}</div>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Tanggal</th>
              <th>Tipe</th>
              <th>Kategori</th>
              <th>Keterangan</th>
              <th style="text-align: right;">Nominal</th>
            </tr>
          </thead>
          <tbody>
            ${transaksi.map(t => `
              <tr>
                <td>${formatDate(t.tanggal_transaksi)}</td>
                <td>
                  <span class="type-badge type-${t.type_transaksi}">
                    ${t.type_transaksi}
                  </span>
                </td>
                <td>${t.kategori}</td>
                <td>${t.description || "-"}</td>
                <td style="text-align: right;" class="nominal ${t.type_transaksi === 'pemasukan' ? 'income' : 'expense'}">
                  ${t.type_transaksi === 'pengeluaran' ? '-' : ''}${formatCurrency(Number(t.nominal_transaksi))}
                </td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="footer">
          Dicetak pada ${new Date().toLocaleString('id-ID')} &bull; FinanceKu App
        </div>
      </body>
      </html>
    `;

    // 7. Generate PDF with Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    
    const pdf = await page.pdf({
      format: "A4",
      margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
      printBackground: true,
    });

    await browser.close();

    // 8. Return PDF Response
    return new NextResponse(Buffer.from(pdf), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Laporan-Transaksi-${startDate}-ke-${endDate}.pdf"`,
      },
    });

  } catch (error: any) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat membuat PDF: " + error.message },
      { status: 500 }
    );
  }
}
