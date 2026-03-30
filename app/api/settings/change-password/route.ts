import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import clientPromise from "@/app/lib/mongodb";

function formatDateWIB(date: Date) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = fmt.formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;

  return `${map.day}/${map.month}/${map.year} ${map.hour}:${map.minute}:${map.second}`;
}

export async function POST(req: NextRequest) {
  try {
    const { email, currentPassword, newPassword } = await req.json();

    if (!email || !currentPassword || !newPassword) {
      return NextResponse.json(
        { message: "Email dan password wajib diisi" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const usersCollection = db.collection("users");

    // Cari user berdasarkan email
    const user = await usersCollection.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    // Verifikasi password lama
    const isValid = await bcrypt.compare(currentPassword, user.password);

    if (!isValid) {
      return NextResponse.json(
        { message: "Password lama salah" },
        { status: 400 },
      );
    }

    // Hash password baru
    const newHash = await bcrypt.hash(newPassword, 10);
    const updatedAt = formatDateWIB(new Date());

    // Update password dan timestamp
    await usersCollection.updateOne(
      { _id: user._id },
      {
        $set: {
          password: newHash,
          updatedAt: updatedAt,
        },
      },
    );

    return NextResponse.json({ message: "Password berhasil diubah" });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}