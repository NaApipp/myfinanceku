import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { randomUUID } from "crypto";
import { withCors, handleOptions } from "@/app/lib/cors";

export const OPTIONS = handleOptions;

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Validasi input sederhana
    if (!email || !password) {
      return withCors(NextResponse.json(
        { message: "Email dan password harus diisi" },
        { status: 400 },
      ));
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const usersCollection = db.collection("users_admin"); 

    // Cari user berdasarkan email
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return withCors(NextResponse.json(
        { message: "Email atau Passwordd salah" },
        { status: 404 },
      ));
    }

    // Verifikasi password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return withCors(NextResponse.json({ message: "Email atau Password salah" }, { status: 401 }));
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

    return withCors(response);
  } catch (error) {
    console.error("Login error:", error);
    return withCors(NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    ));
  }
}