import { withCors, handleOptions } from "@/app/lib/cors";
/**
 * API Route — Webhook Midtrans
 * Nama file : app/api/subscription/webhook/route.ts
 *
 * Endpoint : POST /api/subscription/webhook
 * Tugas    : Terima notifikasi Midtrans → verifikasi → update level user
 *
 * ⚠️  Daftarkan URL ini di Midtrans Dashboard:
 *     Sandbox → https://dashboard.sandbox.midtrans.com
 *     Settings → Configuration → Payment Notification URL
 *     Isi: https://your-ngrok-url.ngrok.io/api/subscription/webhook
 */

import { NextRequest, NextResponse } from "next/server";
import { verifySignature }           from "@/app/lib/midtrans";
import clientPromise                 from "@/app/lib/mongodb";
import { ObjectId }                  from "mongodb";

// ─── Durasi Plan ──────────────────────────────────────────────────────────────

const PLAN_DURATION_MS: Record<string, number | null> = {
  medium  : 30 * 24 * 60 * 60 * 1000, // 30 hari dalam milidetik
  advanced: null,                       // null = selamanya
};

// ─── Handler ──────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      order_id          : orderId,
      status_code       : statusCode,
      gross_amount      : grossAmount,
      signature_key     : signatureKey,
      transaction_status: transactionStatus,
      fraud_status      : fraudStatus,
    } = body;

    // 1. Verifikasi signature dari Midtrans — WAJIB, mencegah request palsu
    const isValid = verifySignature({ orderId, statusCode, grossAmount, signatureKey });
    if (!isValid) {
      console.warn("[webhook] ⚠️  Signature tidak valid, order:", orderId);
      return withCors(NextResponse.json({ message: "Invalid signature" }, { status: 403 }), req);
    }

    const client = await clientPromise;
    const db     = client.db(process.env.MONGODB_DATABASE);

    // 2. Cari transaksi di MongoDB
    const transaksi = await db.collection("transactions").findOne({ orderId });
    if (!transaksi) {
      console.warn("[webhook] Transaksi tidak ditemukan:", orderId);
      // Tetap return 200 agar Midtrans tidak retry
      return withCors(NextResponse.json({ ok: true }, { status: 200 }), req);
    }

    // 3. Tentukan status berdasarkan respons Midtrans
    //    Ref: https://docs.midtrans.com/docs/status-cycle-and-status-definition
    const isPaid =
      (transactionStatus === "capture" && fraudStatus === "accept") ||
      transactionStatus === "settlement";

    const isFailed =
      transactionStatus === "cancel" ||
      transactionStatus === "deny"   ||
      transactionStatus === "expire";

    const now = new Date();

    if (isPaid) {
      // ── Pembayaran berhasil ───────────────────────────────────────────────
      const duration  = PLAN_DURATION_MS[transaksi.plan];
      const expiredAt = duration ? new Date(now.getTime() + duration) : null;

      // Update level & subscription user
      await db.collection("users").updateOne(
        { _id: new ObjectId(transaksi.userId) },
        {
          $set: {
            level                         : transaksi.plan,
            "subscription.status"         : "active",
            "subscription.plan"           : transaksi.plan,
            "subscription.startDate"      : now,
            "subscription.expiredAt"      : expiredAt,
            "subscription.midtransOrderId": orderId,
            updatedAt                     : now,
          },
        }
      );

      // Update status transaksi
      await db.collection("transactions").updateOne(
        { orderId },
        {
          $set: {
            status         : "paid",
            midtransPayload: body,
            updatedAt      : now,
          },
        }
      );

      console.log(`[webhook] ✅ Sukses — user: ${transaksi.idUser}, plan: ${transaksi.plan}`);

    } else if (isFailed) {
      // ── Pembayaran gagal ──────────────────────────────────────────────────
      await db.collection("transactions").updateOne(
        { orderId },
        {
          $set: {
            status         : "failed",
            midtransPayload: body,
            updatedAt      : now,
          },
        }
      );

      console.log(`[webhook] ❌ Gagal — orderId: ${orderId}, status: ${transactionStatus}`);

    } else {
      // ── Pending / status lain ─────────────────────────────────────────────
      await db.collection("transactions").updateOne(
        { orderId },
        {
          $set: {
            status         : "pending",
            midtransPayload: body,
            updatedAt      : now,
          },
        }
      );

      console.log(`[webhook] ⏳ Pending — orderId: ${orderId}`);
    }

    // Selalu balas 200 ke Midtrans agar tidak retry terus
    return withCors(NextResponse.json({ ok: true }, { status: 200 }), req);

  } catch (error) {
    console.error("[webhook] Error:", error);
    // Tetap 200 agar Midtrans tidak spam retry
    return withCors(NextResponse.json({ ok: true }, { status: 200 }), req);
  }
}
export const OPTIONS = handleOptions;
