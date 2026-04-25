import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { randomUUID } from "crypto";

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
        { message: "Username atau Passwordd salah" },
        { status: 404 },
      );
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json({ message: "Username atau Password salah" }, { status: 401 });
    }

    // Generate JWT
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_secret",
    );
    const refreshSecret = new TextEncoder().encode(
      process.env.JWT_REFRESH_SECRET || "default_refresh_secret",
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

    const refreshToken = await new SignJWT({ userId: user.idUser || user._id.toString() })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("14d")
      .setJti(randomUUID())
      .sign(refreshSecret);

    const response = NextResponse.json(
      {
        message: "Login berhasil",
        user: {
          email: user.email,
          username: user.username,
          no_hp: user.no_hp,
          level: user.level,
          full_name: user.full_name,
          image_url: user.image_url || null,
          token: token,
          refreshToken: refreshToken,
        },
      },
      { status: 200 },
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
      maxAge: 60 * 60 * 24 * 14, // 14 hari
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