import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { refresh } from "next/cache";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    // Validasi input sederhana
    if (!username || !password) {
      return NextResponse.json(
        { message: "Username dan password harus diisi" },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const usersCollection = db.collection("users"); 

    // Cari user berdasarkan email
    const user = await usersCollection.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 },
      );
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Password salah" }, { status: 401 });
    }

    // Generate JWT
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_secret",
    );
    const token = await new SignJWT({
      userId: user.idUser || user._id.toString(), // Menggunakan idUser dari DB atau _id sebagai fallback
      username: user.username,
      email: user.email,
      level: user.level,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1d") // Token berlaku 1 tahun (unlimited simulasi)
      .sign(secret);

    const response = NextResponse.json(
      {
        message: "Login berhasil",
        user: {
          email: user.email,
          username: user.username,
          no_hp: user.no_hp,
          level: user.level,
          full_name: user.full_name,
          token: token,
        },
      },
      { status: 200 },
    );

    // Set cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      // maxAge dihapus agar menjadi session cookie (terhapus saat tab/browser tutup)
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}