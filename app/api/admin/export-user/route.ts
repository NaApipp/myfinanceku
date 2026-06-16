import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { generateExport, ExportFormat } from "@/app/lib/exportUtils";

const MONGODB_URI = process.env.MONGODB_URI!;
const DB_NAME = process.env.MONGODB_DATABASE;

export async function GET(request: NextRequest) {
  // ── 1. Autentikasi admin (sesuaikan dengan auth kamu) ──
  // Contoh: cek session/token admin di sini
  // const session = await getServerSession(authOptions);
  // if (!session?.user?.isAdmin) {
  //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  // }

  // ── 2. Ambil format dari query param ──
  const { searchParams } = new URL(request.url);
  const format = (searchParams.get("format") ?? "xlsx") as ExportFormat;

  if (!["xlsx", "csv"].includes(format)) {
    return NextResponse.json(
      { error: "Format tidak valid. Gunakan 'xlsx' atau 'csv'." },
      { status: 400 }
    );
  }

  // ── 3. Ambil semua data user dari MongoDB ──
  let client: MongoClient | null = null;

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();

    const db = client.db(DB_NAME);
    const users = await db
      .collection("users")
      .find({}, { projection: { password: 0, __v: 0 } }) // exclude field sensitif
      .toArray();

    if (users.length === 0) {
      return NextResponse.json({ error: "Tidak ada data user." }, { status: 404 });
    }

    // Konversi ObjectId & Date ke string agar bisa di-serialize
    const sanitized = users.map((user) => ({
      ...user,
      _id: user._id.toString(),
      createdAt: user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : user.createdAt,
      updatedAt: user.updatedAt instanceof Date
        ? user.updatedAt.toISOString()
        : user.updatedAt,
    }));

    // ── 4. Generate file ──
    const buffer = generateExport(sanitized, format);

    const timestamp = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const filename = `users_export_${timestamp}.${format}`;

    const contentType =
      format === "xlsx"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "text/csv;charset=utf-8;";

    return new Response(buffer as any, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data." },
      { status: 500 }
    );
  } finally {
    await client?.close();
  }
}