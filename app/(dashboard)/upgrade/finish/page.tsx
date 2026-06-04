"use client";

/**
 * Halaman Finish Pembayaran — MyFinanceKu
 * Nama file : app/(dashboard)/upgrade/finish/page.tsx
 *
 * Ditampilkan setelah user selesai di halaman Midtrans Snap.
 * Membaca query param ?status= untuk menampilkan pesan yang sesuai.
 */

import { useSearchParams, useRouter } from "next/navigation";

type StatusKey = "success" | "pending" | "error";

const CONTENT: Record<StatusKey, { icon: string; title: string; desc: string; color: string }> = {
  success: {
    icon : "🎉",
    title: "Pembayaran Berhasil!",
    desc : "Level akun kamu sudah diupgrade. Silakan login ulang agar perubahan aktif.",
    color: "text-green-600",
  },
  pending: {
    icon : "⏳",
    title: "Menunggu Pembayaran",
    desc : "Pembayaran kamu sedang diproses. Level akan diupgrade otomatis setelah pembayaran terkonfirmasi.",
    color: "text-yellow-600",
  },
  error: {
    icon : "❌",
    title: "Pembayaran Gagal",
    desc : "Terjadi masalah dengan pembayaran kamu. Silakan coba lagi.",
    color: "text-red-600",
  },
};

export default function FinishPage() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const statusParam  = searchParams.get("status") as StatusKey | null;
  const content      = CONTENT[statusParam as StatusKey] ?? {
    icon : "ℹ️",
    title: "Status Tidak Diketahui",
    desc : "Silakan cek halaman profil kamu untuk status terbaru.",
    color: "text-gray-600",
  };

  // Handle Logout
  const handleLogout = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const sessionUser = sessionStorage.getItem("user");
      let token = "";
      if (sessionUser) {
        try {
          const parsed = JSON.parse(sessionUser);
          token = parsed.token || "";
        } catch (err) {}
      }

      await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      sessionStorage.removeItem("user");
      window.location.href = "/login";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">{content.icon}</div>
        <h1 className={`text-2xl font-bold mb-3 ${content.color}`}>{content.title}</h1>
        <p className="text-gray-500 mb-8 text-sm leading-relaxed">{content.desc}</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {statusParam !== "success" && (
            <button
            onClick={() => router.push("/general")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition text-sm"
          >
            Kembali ke Dashboard
          </button>
          )}
          {statusParam === "success" && (
            <form onSubmit={handleLogout} action="">
            <button
              type="submit"
              className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-xl font-semibold transition text-sm"
            >
              Login Ulang
            </button>
          </form>
          )}
        </div>
      </div>
    </div>
  );
}