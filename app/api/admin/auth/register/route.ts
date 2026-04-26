import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { randomUUID } from "crypto";
import { withCors, handleOptions } from "@/app/lib/cors";

export const OPTIONS = handleOptions;

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
    const { username, password, email } = await req.json();

    // Validasi input sederhana
    if (!username || !password || !email) {
      return withCors(NextResponse.json(
        { message: "Semua field harus diisi" },
        { status: 400 },
      ));
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const usersCollection = db.collection("users_admin");

    // Cek apakah email sudah terdaftar
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return withCors(NextResponse.json(
        { message: "Email sudah terdaftar" },
        { status: 400 },
      ));
    }

    // Generate ID baru
    const idUser = randomUUID();

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user baru
    await usersCollection.insertOne({
      idUser,
      username,
      password: hashedPassword,
      email,
      created_at: formatDateWIB(new Date()),
      updated_at: formatDateWIB(new Date()),
    });

    // Generate token untuk user yang baru didaftarkan
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_secret",
    );
    const refreshToken = await new SignJWT({ userId: idUser })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("14d")
      .setJti(randomUUID())
      .sign(secret);

    const token = await new SignJWT({
      userId: idUser,
      username,
      email
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d")
      .sign(secret);

    const response = NextResponse.json(
      {
        message: "Registrasi berhasil",
        user: {
          idUser,
          username,
          email,
          token,
          refreshToken,
        },
      },
      { status: 201 },
    );

    // Set cookies
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
    });

    response.cookies.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 14,
    });

    return withCors(response);
  } catch (error) {
    console.error("Registration error:", error);
    return withCors(NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    ));
  }
}