"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Lock,
  KeyRound,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

export default function Page() {
  const [user, setUser] = useState<{ email: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Failed to parse user data", error);
      }
    }
  }, []);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage({
        type: "error",
        text: "Konfirmasi password baru tidak cocok.",
      });
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage({
        type: "error",
        text: "Password baru harus minimal 6 karakter.",
      });
      setLoading(false);
      return;
    }

    if (!user?.email) {
      setMessage({ type: "error", text: "Sesi habis, silakan login kembali." });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/settings/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Gagal mengubah password.");
      }

      setMessage({ type: "success", text: "Password berhasil diperbarui." });
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error: any) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" mx-auto py-8 px-4 bg-[#F5F5F5] flex justify-center ">
      <div className=" bg-white rounded-3xl shadow-md overflow-hidden max-w-2xl w-full">
        <div className="p-8 border-b border-gray-400">
          <h1 className="text-2xl font-bold text-black">Ubah Password</h1>
          <p className="text-sm text-[#737373] mt-1">
            Perbarui kata sandi akun Anda secara berkala untuk keamanan
            maksimal.
          </p>
        </div>

        <div className="p-8">
          {message.text && (
            <div
              className={`mb-8 p-4 rounded-2xl flex items-center gap-3 text-sm font-medium ${
                message.type === "error"
                  ? "bg-red-50 text-red-600 border border-red-100"
                  : "bg-green-50 text-green-600 border border-green-100"
              }`}
            >
              {message.type === "error" ? (
                <AlertCircle className="w-5 h-5" />
              ) : (
                <CheckCircle2 className="w-5 h-5" />
              )}
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-gray-50 p-5 rounded-2xl border border-gray-400 mb-2">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Akun Saat Ini
              </p>
              <p className="text-sm font-semibold text-black">
                {user?.email || "Memuat akun..."}
              </p>
            </div>

            <div className="space-y-1.5 mt-2">
              <label
                className="block text-sm font-semibold text-gray-600"
                htmlFor="currentPassword"
              >
                Password Saat Ini
              </label>
              <input
                id="currentPassword"
                type="password"
                required
                value={formData.currentPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-500 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm outline-none"
                placeholder="••••••••"
              />
            </div>

            <div className="space-y-1.5">
              <label
                className="block text-sm font-semibold text-gray-600"
                htmlFor="newPassword"
              >
                Password Baru
              </label>
              <input
                id="newPassword"
                type="password"
                required
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-500  border-none rounded-2xl focus:ring-2 focus:ring-black dark:focus:ring-white transition-all text-sm outline-none"
                placeholder="Minimal 6 karakter"
              />
            </div>

            <div className="space-y-1.5">
              <label
                className="block text-sm font-semibold text-gray-600"
                htmlFor="confirmPassword"
              >
                Konfirmasi Password Baru
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-500 border-none rounded-2xl focus:ring-2 focus:ring-black transition-all text-sm outline-none"
                placeholder="Ulangi password baru"
              />
            </div>

            <div className="pt-4 flex flex-col gap-3">
              <button
                type="submit"
                disabled={loading}
                className="font-poppins font-semibold items-center justify-center w-full px-6 py-2.5 text-center text-white duration-200 bg-black border-2 border-black rounded-full nline-flex hover:bg-transparent hover:border-black hover:text-black focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />{" "}
                    Memproses...
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </button>
              <Link
                href="/dashboard/pengaturan"
                className="font-poppins font-semibold items-center justify-center w-full px-6 py-2.5 text-center text-[#374151] duration-200 bg-[#E5E7EB] border-2 border-[#9CA3AF] rounded-full nline-flex hover:bg-transparent hover:border-[#9CA3AF] hover:text-[#374151] focus:outline-none focus-visible:outline-black text-sm focus-visible:ring-black"
              >
                Kembali
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
