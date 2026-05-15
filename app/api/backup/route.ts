import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { jwtVerify } from "jose";
import { renderToBuffer } from "@react-pdf/renderer";
import { BackupPdf } from "@/app/components/pdf/BackupPdf";

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

    // 2. Fetch Data from MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);

    // Parallel fetching for better performance
    const [user, transaksi, target, category, anggaran, accounts] = await Promise.all([
      db.collection("users").findOne({ idUser: userId }),
      db.collection("transaksi").find({ userId }).sort({ tanggal_transaksi: -1 }).toArray(),
      db.collection("target").find({ userId }).toArray(),
      db.collection("category").find({ userId }).toArray(),
      db.collection("anggaran").find({ userId }).toArray(),
      db.collection("account-card").find({ userId }).toArray(),
    ]);

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 3. Prepare Data for PDF
    const userData = {
      full_name: user.full_name,
      email: user.email,
      username: user.username,
      no_hp: user.no_hp,
    };

    // 4. Generate PDF
    const pdfBuffer = await renderToBuffer(
      BackupPdf({
        user: userData,
        transaksi,
        target,
        category,
        anggaran,
        accounts,
      })
    );

    // 5. Return PDF Response
    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="Backup-Data-${userData.username}-${new Date().toISOString().split('T')[0]}.pdf"`,
        "Content-Length": pdfBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("Error generating backup PDF:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat membuat backup: " + error.message },
      { status: 500 },
    );
  }
}
