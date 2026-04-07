import { NextRequest, NextResponse } from "next/server";
import { createTarget } from "@/app/lib/targetService";
import { jwtVerify } from "jose";
import clientPromise from "@/app/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_secret",
    );
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId ? String(payload.userId) : null;

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid user session" },
        { status: 401 },
      );
    }

    // Generate unique ID using random string to avoid collisions if transactions are deleted
    const uniqueId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const idTarget = `TRGT-${userId.slice(-4)}-${uniqueId}`;
    const body = await req.json();
    const {
      nama_target,
      tanggal_target,
      jumlah_target,
      idAccount,
      prioritas,
      description,
    } = body;

    if (
      !nama_target ||
      !tanggal_target ||
      !jumlah_target ||
      !idAccount ||
      !prioritas
    ) {
      return NextResponse.json(
        { message: "Semua field wajib diisi" },
        { status: 400 },
      );
    }

    const result = await createTarget({
      userId,
      idTarget,
      nama_target,
      tanggal_target,
      jumlah_target: Number(jumlah_target),
      idAccount,
      prioritas,
      description,
    });

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Berhasil" });
  } catch (err: any) {
    console.error("Error processing target:", err);
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}


export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_secret",
    );
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId ? String(payload.userId) : null;

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid user session" },
        { status: 401 },
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const targets = await db.collection("target").find({ userId }).toArray();
    return NextResponse.json({ success: true, targets });
  } catch (err: any) {
    console.error("Error processing target:", err);
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 },
    );
  }
}