"use client";

/**
 * Halaman Upgrade Plan — MyFinanceKu
 * Nama file : app/(dashboard)/upgrade/page.tsx
 */

import { useState, useEffect } from "react";
import { useRouter }           from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserSession {
  level   : string;
  username: string;
  email   : string;
}

// ─── Data Plan ────────────────────────────────────────────────────────────────

const PLANS = [
  {
    key     : "basic",
    label   : "Basic",
    price   : "Gratis",
    period  : "",
    border  : "border-gray-200",
    badge   : "bg-gray-100 text-gray-600",
    btnClass: "bg-gray-100 text-gray-400 cursor-not-allowed",
    features: [
      { text: "Tambah transaksi",  ok: true  },
      { text: "Lihat statistik",   ok: false },
      { text: "Atur anggaran",     ok: false },
      { text: "Atur target",       ok: false },
    ],
  },
  {
    key     : "medium",
    label   : "Medium",
    price   : "Rp 30.000",
    period  : "/ bulan",
    border  : "border-blue-400",
    badge   : "bg-blue-100 text-blue-700",
    btnClass: "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer",
    features: [
      { text: "Tambah transaksi",  ok: true  },
      { text: "Lihat statistik",   ok: true  },
      { text: "Atur anggaran",     ok: true  },
      { text: "Atur target",       ok: false },
    ],
  },
  {
    key     : "advanced",
    label   : "Advanced",
    price   : "Rp 50.000",
    period  : "/ selamanya",
    border  : "border-yellow-400",
    badge   : "bg-yellow-100 text-yellow-700",
    btnClass: "bg-yellow-500 hover:bg-yellow-600 text-white cursor-pointer",
    features: [
      { text: "Tambah transaksi",  ok: true },
      { text: "Lihat statistik",   ok: true },
      { text: "Atur anggaran",     ok: true },
      { text: "Atur target",       ok: true },
    ],
  },
];

// ─── Extend Window untuk Midtrans Snap ───────────────────────────────────────

declare global {
  interface Window {
    snap: {
      pay: (token: string, options: {
        onSuccess : (result: unknown) => void;
        onPending : (result: unknown) => void;
        onError   : (result: unknown) => void;
        onClose   : () => void;
      }) => void;
    };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function UpgradePage() {
  const router                          = useRouter();
  const [user, setUser]                 = useState<UserSession | null>(null);
  const [loadingPlan, setLoadingPlan]   = useState<string | null>(null);
  const [error, setError]               = useState<string | null>(null);
  const [snapReady, setSnapReady]       = useState(false);

  // Ambil data user dari localStorage / cookies
  // Sesuaikan dengan cara kamu menyimpan data user setelah login
  useEffect(() => {
    const stored = sessionStorage.getItem("user");
    if (stored) {
      try { setUser(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  // Load Midtrans Snap script secara dynamic
  useEffect(() => {
    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
    const snapUrl      = isProduction
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";

    const script = document.createElement("script");
    script.src               = snapUrl;
    script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "");
    script.onload            = () => setSnapReady(true);
    document.body.appendChild(script);

    return () => { document.body.removeChild(script); };
  }, []);

  async function handleUpgrade(planKey: string) {
    if (!snapReady) {
      setError("Payment gateway belum siap, tunggu sebentar.");
      return;
    }

    setError(null);
    setLoadingPlan(planKey);

    try {
      // 1. Minta Snap token dari backend
      const res = await fetch("/api/subscription/create-payment", {
        method : "POST",
        headers: { "Content-Type": "application/json" },
        body   : JSON.stringify({ plan: planKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal membuat pembayaran");
      }

      // 2. Tampilkan Snap popup Midtrans
      window.snap.pay(data.snapToken, {
        onSuccess: (result) => {
          console.log("Pembayaran berhasil:", result);
          router.push("/upgrade/finish?status=success");
        },
        onPending: (result) => {
          console.log("Menunggu pembayaran:", result);
          router.push("/upgrade/finish?status=pending");
        },
        onError: (result) => {
          console.error("Pembayaran error:", result);
          setError("Pembayaran gagal. Silakan coba lagi.");
          setLoadingPlan(null);
        },
        onClose: () => {
          console.log("Popup ditutup sebelum selesai bayar");
          setLoadingPlan(null);
        },
      });

    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
      setLoadingPlan(null);
    }
  }

  const currentLevel = user?.level || "basic";

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">Pilih Plan Kamu</h1>
        <p className="text-gray-500 mt-2">
          Plan saat ini:{" "}
          <span className="font-semibold capitalize text-blue-600">{currentLevel}</span>
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 text-center text-sm">
          {error}
        </div>
      )}

      {/* Plan cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const isCurrentPlan = plan.key === currentLevel;
          const isLoading     = loadingPlan === plan.key;
          const isDisabled    = isCurrentPlan || plan.key === "basic";

          return (
            <div
              key={plan.key}
              className={`relative rounded-2xl border-2 p-6 flex flex-col gap-4 shadow-sm transition-shadow ${plan.border} ${
                isCurrentPlan ? "opacity-70" : "hover:shadow-md"
              }`}
            >
              {/* Badge */}
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${plan.badge}`}>
                  {plan.label}
                </span>
                {isCurrentPlan && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                    Plan Aktif
                  </span>
                )}
              </div>

              {/* Harga */}
              <div>
                <span className="text-2xl font-bold text-gray-800">{plan.price}</span>
                {plan.period && (
                  <span className="text-sm text-gray-500 ml-1">{plan.period}</span>
                )}
              </div>

              {/* Fitur */}
              <ul className="flex flex-col gap-2 flex-1">
                {plan.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm text-gray-600">
                    <span>{f.ok ? "✅" : "❌"}</span>
                    <span>{f.text}</span>
                  </li>
                ))}
              </ul>

              {/* Tombol */}
              <button
                onClick={() => !isDisabled && handleUpgrade(plan.key)}
                disabled={isDisabled || isLoading}
                className={`mt-2 w-full py-2.5 rounded-xl text-sm font-semibold transition ${
                  isDisabled ? "bg-gray-100 text-gray-400 cursor-not-allowed" : plan.btnClass
                }`}
              >
                {isLoading
                  ? "Memproses..."
                  : isCurrentPlan
                  ? "Plan Aktif"
                  : plan.key === "basic"
                  ? "Gratis"
                  : `Upgrade ke ${plan.label}`}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}