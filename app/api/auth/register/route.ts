import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";

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
    const { last_name, first_name, email, password, username, no_hp, level } =
      await req.json();

    // Validasi input sederhana
    if (
      !last_name ||
      !first_name ||
      !email ||
      !password ||
      !username ||
      !no_hp
    ) {
      return NextResponse.json(
        { message: "Semua kolom harus diisi" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    // NAMA DB DAN COLLECTION
    const db = client.db(process.env.MONGODB_DATABASE);
    const usersCollection = db.collection("users");

    // Cek apakah email sudah terdaftar
    const existingUser = await usersCollection.findOne({ email, username });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email atau Username sudah terdaftar" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Format Akun Di Buat
    const formattedDate = formatDateWIB(new Date());

    // Simpan user baru
    const result = await usersCollection.insertOne({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      username,
      no_hp,
      level,
      createdAt: formattedDate,
    });

    return NextResponse.json(
      { message: "Registrasi berhasil", userId: result.insertedId },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
