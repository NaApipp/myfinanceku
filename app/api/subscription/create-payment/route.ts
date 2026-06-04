/**
 * API Route — Create Payment
 * Nama file : app/api/subscription/create-payment/route.ts
 *
 * Endpoint : POST /api/subscription/create-payment
 * Tugas    : Baca JWT dari cookie → generate Snap token → simpan transaksi pending
 */

import { NextRequest, NextResponse } from "next/server";
import { getJWTUser }                from "@/app/lib/auth";
import { createSnapToken }           from "@/app/lib/midtrans";
import clientPromise                 from "@/app/lib/mongodb";

// ─── Definisi Plan ────────────────────────────────────────────────────────────

const PLANS = {
  medium: {
    label   : "Medium Plan",
    amount  : 30000,   // Rp 30.000 / bulan
    duration: 30,      // hari
  },
  advanced: {
    label   : "Advanced Plan",
    amount  : 50000,   // Rp 50.000 / selamanya
    duration: null,    // null = selamanya
  },
} as const;

type PlanKey = keyof typeof PLANS;

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    // 1. Verifikasi JWT dari cookie — pengganti getServerSession
    const jwtUser = await getJWTUser();
    if (!jwtUser) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Validasi plan dari request body
    const { plan } = await req.json();
    if (!plan || !(plan in PLANS)) {
      return NextResponse.json({ message: "Plan tidak valid" }, { status: 400 });
    }

    const selectedPlan = PLANS[plan as PlanKey];

    // 3. Ambil data user terbaru dari MongoDB
    const client = await clientPromise;
    const db     = client.db(process.env.MONGODB_DATABASE);
    const user   = await db.collection("users").findOne({ username: jwtUser.username });

    if (!user) {
      return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
    }

    // 4. Cek apakah sudah berlangganan plan yang sama
    if (user.level === plan && user.subscription?.status === "active") {
      return NextResponse.json(
        { message: "Kamu sudah berlangganan plan ini" },
        { status: 400 }
      );
    }

    // 5. Generate order ID unik
    //    Format: MFK-{idUser}-{timestamp}
    const orderId = `MFK-${user.idUser || user._id.toString()}-${Date.now()}`;

    // 6. Buat Snap token via Midtrans
    const snapData = await createSnapToken({
      orderId,
      amount       : selectedPlan.amount,
      customerName : user.full_name || user.username,
      customerEmail: user.email,
    });

    // 7. Simpan transaksi ke MongoDB dengan status "pending"
    await db.collection("transactions").insertOne({
      userId   : user._id,
      idUser   : user.idUser,
      orderId,
      plan,
      amount   : selectedPlan.amount,
      status   : "pending",
      snapToken: snapData.token,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // 8. Kembalikan Snap token ke frontend
    return NextResponse.json({ snapToken: snapData.token }, { status: 200 });

  } catch (error) {
    console.error("[create-payment] Error:", error);
    return NextResponse.json({ message: "Terjadi kesalahan server" }, { status: 500 });
  }
}