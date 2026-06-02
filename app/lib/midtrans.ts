/**
 * Midtrans Configuration — MyFinanceKu
 * Nama file : app/lib/midtrans.ts
 *
 * Helper untuk membuat Snap token & verifikasi webhook Midtrans.
 * Tidak perlu install package midtrans-client, cukup pakai fetch native.
 */

import crypto from "crypto";

const MIDTRANS_BASE_URL =
  process.env.MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com/snap/v1/transactions"
    : "https://app.sandbox.midtrans.com/snap/v1/transactions";

const MIDTRANS_SERVER_KEY = process.env.MIDTRANS_SERVER_KEY!;

/** Encode Server Key ke Base64 untuk Basic Auth header Midtrans */
function getAuthHeader(): string {
  return `Basic ${Buffer.from(`${MIDTRANS_SERVER_KEY}:`).toString("base64")}`;
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SnapTokenParams {
  orderId      : string;
  amount       : number;
  customerName : string;
  customerEmail: string;
}

export interface SnapTokenResult {
  token       : string;
  redirect_url: string;
}

export interface VerifySignatureParams {
  orderId      : string;
  statusCode   : string;
  grossAmount  : string;
  signatureKey : string;
}

// ─── Functions ────────────────────────────────────────────────────────────────

/**
 * Buat Snap Token untuk memunculkan popup pembayaran Midtrans
 */
export async function createSnapToken({
  orderId,
  amount,
  customerName,
  customerEmail,
}: SnapTokenParams): Promise<SnapTokenResult> {
  if (!MIDTRANS_SERVER_KEY) {
    throw new Error("MIDTRANS_SERVER_KEY tidak ditemukan di .env.local");
  }

  const payload = {
    transaction_details: {
      order_id    : orderId,
      gross_amount: amount,
    },
    customer_details: {
      first_name: customerName,
      email     : customerEmail,
    },
    callbacks: {
      finish: `${process.env.NEXT_PUBLIC_BASE_URL}/upgrade/finish`,
    },
  };

  const response = await fetch(MIDTRANS_BASE_URL, {
    method : "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": getAuthHeader(),
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`Midtrans error: ${JSON.stringify(error)}`);
  }

  return response.json();
}

/**
 * Verifikasi signature dari webhook Midtrans
 * WAJIB dipakai di webhook handler untuk mencegah request palsu
 */
export function verifySignature({
  orderId,
  statusCode,
  grossAmount,
  signatureKey,
}: VerifySignatureParams): boolean {
  const hash = crypto
    .createHash("sha512")
    .update(`${orderId}${statusCode}${grossAmount}${MIDTRANS_SERVER_KEY}`)
    .digest("hex");

  return hash === signatureKey;
}