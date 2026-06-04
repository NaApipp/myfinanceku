"use client";

import { useEffect, useState } from "react";
import { X, Check, Shield, Zap, Crown, AlertCircle, Loader2, Sparkles, CreditCard } from "lucide-react";

interface UpgradePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newLevel: string) => void;
}

interface UserSession {
  email: string;
  username: string;
  no_hp: string;
  level: string;
  full_name: string;
  image_url: string | null;
  token?: string;
  refreshToken?: string;
}

export default function UpgradePlanModal({ isOpen, onClose, onSuccess }: UpgradePlanModalProps) {
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [dbUser, setDbUser] = useState<any>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [snapReady, setSnapReady] = useState(false);

  // Load Midtrans Snap script secara dynamic
  useEffect(() => {
    if (!isOpen) return;

    const isProduction = process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true";
    const snapUrl = isProduction
      ? "https://app.midtrans.com/snap/snap.js"
      : "https://app.sandbox.midtrans.com/snap/snap.js";

    // Check if script already exists to avoid duplicate scripts
    const existingScript = document.getElementById("midtrans-snap-script");
    if (existingScript) {
      setSnapReady(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "midtrans-snap-script";
    script.src = snapUrl;
    script.setAttribute("data-client-key", process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || "");
    script.onload = () => setSnapReady(true);
    document.body.appendChild(script);

    return () => {
      const el = document.getElementById("midtrans-snap-script");
      if (el) {
        document.body.removeChild(el);
      }
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setError("");
      setSuccess(false);
      const userData = sessionStorage.getItem("user");
      if (userData) {
        try {
          const parsed = JSON.parse(userData);
          setCurrentUser(parsed);
          fetchDbUser(parsed.username);
        } catch (e) {
          console.error("Failed to parse user data", e);
        }
      }
    }
  }, [isOpen]);

  const fetchDbUser = async (username: string) => {
    try {
      const response = await fetch("/api/admin/user_cust");
      const result = await response.json();
      if (result.success) {
        const found = result.data.find((u: any) => u.username === username);
        if (found) {
          setDbUser(found);
        }
      }
    } catch (err) {
      console.error("Error fetching user id", err);
    }
  };

  const handleUpgrade = async (targetLevel: "Basic" | "Medium" | "Advanced") => {
    if (!currentUser) return;
    
    // If user is already at this level
    if (currentUser.level?.toLowerCase() === targetLevel.toLowerCase()) {
      onClose();
      return;
    }

    setLoading(true);
    setError("");

    // For Free / Basic plan, update directly via PATCH
    if (targetLevel === "Basic") {
      try {
        let idUser = dbUser?.idUser;
        if (!idUser) {
          const response = await fetch("/api/admin/user_cust");
          const result = await response.json();
          if (result.success) {
            const found = result.data.find((u: any) => u.username === currentUser.username);
            if (found) {
              idUser = found.idUser;
            }
          }
        }

        if (!idUser) {
          throw new Error("User ID tidak ditemukan. Silakan coba login kembali.");
        }

        const response = await fetch(`/api/admin/user_cust/${idUser}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ level: targetLevel }),
        });

        if (response.ok) {
          const updatedUser = { ...currentUser, level: targetLevel };
          sessionStorage.setItem("user", JSON.stringify(updatedUser));
          setSuccess(true);
          if (onSuccess) onSuccess(targetLevel);
          setTimeout(() => {
            onClose();
            window.location.reload();
          }, 1500);
        } else {
          const json = await response.json();
          setError(json.message || "Gagal memperbarui level paket.");
        }
      } catch (err: any) {
        console.error("Error upgrading plan:", err);
        setError(err.message || "Terjadi kesalahan saat memproses paket Basic.");
      } finally {
        setLoading(false);
      }
      return;
    }

    // For Paid plans (Medium or Advanced), use Midtrans Snap payment gateway
    try {
      if (!snapReady || !(window as any).snap) {
        throw new Error("Payment gateway belum siap, silakan tunggu sebentar.");
      }

      const planKey = targetLevel.toLowerCase(); // "medium" or "advanced"
      const res = await fetch("/api/subscription/create-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.message || "Gagal membuat transaksi pembayaran.");
      }

      (window as any).snap.pay(data.snapToken, {
        onSuccess: (result: any) => {
          console.log("Pembayaran berhasil:", result);
          setSuccess(true);
          window.location.href = "/upgrade/finish?status=success";
        },
        onPending: (result: any) => {
          console.log("Menunggu pembayaran:", result);
          window.location.href = "/upgrade/finish?status=pending";
        },
        onError: (result: any) => {
          console.error("Pembayaran error:", result);
          setError("Pembayaran gagal. Silakan coba lagi.");
          setLoading(false);
        },
        onClose: () => {
          console.log("Popup pembayaran ditutup");
          setLoading(false);
        },
      });
    } catch (err: any) {
      console.error("Error initiating payment:", err);
      setError(err.message || "Terjadi kesalahan koneksi saat memproses pembayaran.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentLevelNormalized = currentUser?.level || "Basic";

  const plans = [
    {
      name: "Basic",
      levelKey: "Basic" as const,
      tagline: "Untuk pencatatan keuangan dasar",
      price: "Gratis",
      period: "selamanya",
      themeColor: "from-slate-500 to-slate-700",
      textColor: "text-slate-600 dark:text-slate-400",
      bgColor: "bg-slate-50/50 dark:bg-neutral-900/50",
      borderColor: "border-slate-200 dark:border-neutral-800",
      badgeColor: "bg-slate-100 text-slate-700 dark:bg-slate-500/10 dark:text-slate-400",
      icon: Shield,
      features: [
        { text: "Pencatatan Transaksi Harian", available: true },
        { text: "Akun & Kartu Keuangan", available: true },
        { text: "Pembuatan Target Tabungan", available: false },
        { text: "Grafik & Analisis Statistik", available: false },
        { text: "Pembuatan Anggaran Bulanan", available: false },
      ],
      ctaText: "Paket Saat Ini",
      subText: "Fitur standar gratis selamanya",
    },
    {
      name: "Medium",
      levelKey: "Medium" as const,
      tagline: "Visualisasi & target tabungan terarah",
      price: "Rp 30.000",
      period: "bulan",
      themeColor: "from-blue-500 to-indigo-600",
      textColor: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-white dark:bg-neutral-900",
      borderColor: "border-blue-200 dark:border-blue-500/30",
      badgeColor: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400",
      icon: Zap,
      features: [
        { text: "Pencatatan Transaksi Harian", available: true },
        { text: "Akun & Kartu Keuangan", available: true },
        { text: "Pembuatan Target Tabungan", available: true },
        { text: "Grafik & Analisis Statistik", available: true },
        { text: "Pembuatan Anggaran Bulanan", available: false },
      ],
      ctaText: "Upgrade ke Medium",
      subText: "Hanya Rp1.000 / hari via Midtrans",
    },
    {
      name: "Advanced",
      levelKey: "Advanced" as const,
      tagline: "Solusi terlengkap tanpa batas waktu",
      price: "Rp 50.000",
      period: "selamanya",
      themeColor: "from-amber-500 to-yellow-600",
      textColor: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-gradient-to-b from-amber-500/5 to-transparent dark:from-amber-500/5 dark:to-transparent",
      borderColor: "border-amber-400/80 dark:border-amber-400/40",
      badgeColor: "bg-amber-100 text-amber-800 dark:bg-amber-500/20 dark:text-amber-300",
      icon: Crown,
      features: [
        { text: "Pencatatan Transaksi Harian", available: true },
        { text: "Akun & Kartu Keuangan", available: true },
        { text: "Pembuatan Target Tabungan", available: true },
        { text: "Grafik & Analisis Statistik", available: true },
        { text: "Pembuatan Anggaran Bulanan", available: true },
        { text: "Dukungan CS Prioritas 24/7", available: true },
      ],
      ctaText: "Upgrade ke Advanced",
      isPopular: true,
      subText: "Bayar sekali, aktif selamanya",
    },
  ];

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 overflow-y-auto custom-scrollbar">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative bg-white/90 dark:bg-neutral-950/90 backdrop-blur-xl w-full max-w-5xl rounded-[24px] sm:rounded-[32px] shadow-2xl flex flex-col my-auto max-h-[95vh] sm:max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-300 border border-neutral-200/50 dark:border-white/10">
        
        {/* Ambient Glowing Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[350px] h-[350px] bg-blue-500/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[350px] h-[350px] bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

        {/* Decorative Top Gradient bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 via-purple-500 to-amber-500 animate-pulse shrink-0" />
        
        {/* Header */}
        <div className="p-5 sm:p-8 border-b border-neutral-100 dark:border-white/5 relative z-10 pr-14 sm:pr-20 shrink-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1.5 sm:mb-2">
              <span className="text-[9px] sm:text-[10px] font-bold tracking-widest text-blue-600 dark:text-blue-400 uppercase bg-blue-50 dark:bg-blue-500/10 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-500 animate-pulse" />
                Pilih Upgrade Paket
              </span>
              {currentUser && (
                <span className="text-[9px] sm:text-[10px] font-bold tracking-wide text-neutral-500 dark:text-neutral-400 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
                  Paket Anda: <span className="text-indigo-600 dark:text-indigo-400 font-extrabold uppercase">{currentLevelNormalized}</span>
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-black text-neutral-900 dark:text-white tracking-tight leading-tight">
              Tingkatkan Kendali Keuangan Anda
            </h2>
            <p className="text-[11px] sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium mt-1 sm:mt-2 leading-normal">
              Buka fitur eksklusif untuk membantu mengelola anggaran, target tabungan, dan analisis finansial yang matang.
            </p>
          </div>
          <button 
            onClick={onClose}
            className="absolute top-5 right-5 sm:top-8 sm:right-8 p-2 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-full transition-all text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Error or Success notification */}
        {error && (
          <div className="mx-5 sm:mx-8 mt-4 p-3.5 bg-red-50 dark:bg-red-500/10 border border-red-200/50 dark:border-red-500/20 text-red-600 dark:text-red-400 rounded-xl flex items-center gap-3 text-xs sm:text-sm font-bold animate-shake relative z-10 shrink-0">
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            {error}
          </div>
        )}

        {success && (
          <div className="mx-5 sm:mx-8 mt-4 p-3.5 bg-green-50 dark:bg-green-500/10 border border-green-200/50 dark:border-green-500/20 text-green-600 dark:text-green-400 rounded-xl flex items-center gap-3 text-xs sm:text-sm font-bold relative z-10 shrink-0">
            <Check className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
            Upgrade berhasil diproses! Mengupdate sesi Anda...
          </div>
        )}

        {/* Content Area (Scrollable) */}
        <div className="p-5 sm:p-8 overflow-y-auto flex-1 relative z-10 custom-scrollbar">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-8">
            {plans.map((plan) => {
              const IconComponent = plan.icon;
              const isCurrent = currentLevelNormalized.toLowerCase() === plan.levelKey.toLowerCase();
              
              return (
                <div 
                  key={plan.name}
                  className={`relative flex flex-col justify-between rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-8 border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:scale-[1.01] ${
                    plan.isPopular 
                      ? "bg-amber-500/5 dark:bg-amber-500/[0.02] border-amber-400 dark:border-amber-400/40 shadow-amber-500/5 shadow-2xl md:-translate-y-2 md:hover:-translate-y-3 scale-[1.01]" 
                      : "bg-white/80 dark:bg-neutral-900/80 border-neutral-100 dark:border-neutral-800 hover:border-neutral-200 dark:hover:border-neutral-700"
                  } ${isCurrent ? "ring-2 ring-blue-500 dark:ring-blue-400 bg-blue-500/[0.01]" : ""}`}
                >
                  {plan.isPopular && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 text-[9px] uppercase tracking-widest font-black bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-full shadow-lg flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-white" />
                      Pilihan Terbaik
                    </span>
                  )}

                  <div>
                    {/* Header Plan */}
                    <div className="flex items-center justify-between mb-3 sm:mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`p-2 rounded-xl sm:rounded-2xl bg-gradient-to-br ${plan.themeColor} text-white shadow-sm`}>
                          <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">
                          {plan.name}
                        </h3>
                      </div>
                      
                      {isCurrent && (
                        <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 rounded-full border border-blue-100 dark:border-blue-500/20">
                          Aktif
                        </span>
                      )}
                    </div>

                    <p className="text-[11px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-medium mb-4 sm:mb-6 leading-relaxed">
                      {plan.tagline}
                    </p>

                    {/* Price */}
                    <div className="flex flex-col mb-4 sm:mb-6">
                      <div className="flex items-baseline gap-1 flex-wrap">
                        <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
                          {plan.price}
                        </span>
                        {plan.period && (
                          <span className="text-[10px] sm:text-xs text-neutral-400 dark:text-neutral-500 font-bold uppercase tracking-wider">
                            / {plan.period}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Features List */}
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li 
                          key={idx}
                          className="flex items-start gap-2.5"
                        >
                          <div className={`mt-0.5 rounded-full p-0.5 shrink-0 ${
                            feature.available 
                              ? "bg-green-50 dark:bg-green-500/10 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-500/20" 
                              : "bg-red-50 dark:bg-red-500/10 text-neutral-300 dark:text-neutral-700"
                          }`}>
                            {feature.available ? (
                              <Check className="w-3 h-3 stroke-[3]" />
                            ) : (
                              <X className="w-3 h-3 stroke-[3]" />
                            )}
                          </div>
                          <span className={`text-[11px] sm:text-xs font-semibold ${
                            feature.available 
                              ? "text-neutral-700 dark:text-neutral-200" 
                              : "text-neutral-400 dark:text-neutral-600 line-through decoration-neutral-200 dark:decoration-neutral-800"
                          }`}>
                            {feature.text}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* CTA Button & Helper */}
                  <div className="mt-auto">
                    <button
                      disabled={loading || isCurrent}
                      onClick={() => handleUpgrade(plan.levelKey)}
                      className={`w-full py-3 sm:py-3.5 px-4 rounded-[16px] sm:rounded-[20px] font-bold text-[11px] sm:text-xs uppercase tracking-wider transition-all transform active:scale-95 flex items-center justify-center gap-2 ${
                        isCurrent
                          ? "bg-neutral-100 dark:bg-neutral-900 text-neutral-400 dark:text-neutral-600 cursor-not-allowed border border-neutral-200 dark:border-neutral-800"
                          : plan.isPopular
                            ? "bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600 text-white shadow-xl shadow-amber-500/20 hover:shadow-amber-500/30"
                            : "bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-black shadow-lg shadow-neutral-900/10 dark:shadow-white/5"
                      }`}
                    >
                      {loading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isCurrent ? (
                        "Paket Saat Ini"
                      ) : (
                        <span className="flex items-center gap-1.5">
                          {!isCurrent && plan.levelKey !== "Basic" && <CreditCard className="w-3.5 h-3.5" />}
                          {plan.ctaText}
                        </span>
                      )}
                    </button>
                    <p className="text-[9px] sm:text-[10px] text-center text-neutral-400 dark:text-neutral-500 font-semibold mt-2">
                      {plan.subText}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="bg-neutral-50/50 dark:bg-neutral-900/30 p-4 sm:p-6 text-center border-t border-neutral-100 dark:border-white/5 text-[10px] sm:text-xs text-neutral-500 dark:text-neutral-400 font-semibold relative z-10 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <p className="flex items-center gap-1.5 justify-center sm:justify-start">
            <span>🔒</span> Transaksi aman & terenkripsi otomatis oleh Midtrans.
          </p>
          <div className="flex gap-4">
            <button onClick={onClose} className="hover:underline hover:text-neutral-900 dark:hover:text-white">Batal</button>
            <span className="text-neutral-200 dark:text-neutral-800">|</span>
            <a href="https://discord.gg/FUeeHJWU9c" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Dukungan Support</a>
          </div>
        </div>
      </div>
    </div>
  );
}
