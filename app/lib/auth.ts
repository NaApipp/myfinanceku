/**
 * Auth Helper — MyFinanceKu
 * Nama file : app/lib/auth.ts
 *
 * Helper untuk membaca dan memverifikasi JWT dari cookie
 * di server-side (API routes). Disesuaikan dengan setup jose kamu.
 */

import { jwtVerify } from "jose";
import { cookies }   from "next/headers";

export interface JWTPayload {
  userId  : string;
  username: string;
  email   : string;
  level   : string;
}

/**
 * Ambil dan verifikasi JWT dari cookie "token"
 * Gunakan ini di API routes sebagai pengganti getServerSession
 *
 * @returns JWTPayload jika valid, null jika tidak ada/invalid
 */
export async function getJWTUser(): Promise<JWTPayload | null> {
  try {
    const cookieStore = await cookies();
    const token       = cookieStore.get("token")?.value;

    if (!token) return null;

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_secret"
    );

    const { payload } = await jwtVerify(token, secret);

    return {
      userId  : payload.userId   as string,
      username: payload.username as string,
      email   : payload.email    as string,
      level   : payload.level    as string,
    };
  } catch {
    return null;
  }
}