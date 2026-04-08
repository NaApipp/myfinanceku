"use client";

import {
  Lock,
  ChevronRight,
  CircleUserRound,
  X,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Keamanan() {
  return (
    <div className=" p-4 rounded-lg px-0">
      <h1 className="text-black dark:text-white font-bold text-2xl mb-6">
        Keamanan & Akun
      </h1>

      <div className="flex flex-col gap-2">
        {/* Change Profile */}
        <div className="text-black dark:text-white flex flex-row justify-between items-center bg-white dark:bg-neutral-900 rounded-[32px] shadow-md p-8 border border-gray-100 dark:border-white/5 transition-colors duration-300">
          {/* icon & text */}
          <div className="flex flex-row items-center gap-4">
            <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl">
              <CircleUserRound
                className="text-black dark:text-white"
                width={24}
                height={24}
              />
            </div>
            <div className="">
              <h2 className="text-lg font-semibold">Ganti Profil Pengguna</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Ganti informasi pribadi.
              </p>
            </div>
          </div>
          <ModalProfil />
        </div>
        {/* Change Password */}
        <div className="text-black dark:text-white flex flex-row justify-between items-center bg-white dark:bg-neutral-900 rounded-[32px] shadow-md p-8 border border-gray-100 dark:border-white/5 transition-colors duration-300">
          {/* icon & text */}
          <div className="flex flex-row items-center gap-4">
            <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl">
              <Lock
                className="text-black dark:text-white"
                width={24}
                height={24}
              />
            </div>
            <div className="">
              <h2 className="text-lg font-semibold">Ganti Kata Sandi</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Lakukan jika terjadi hal yang tidak diinginkan.
              </p>
            </div>
          </div>
          <Link
            href="/pengaturan/ubah-password"
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <ChevronRight
              className="text-black dark:text-white"
              width={24}
              height={24}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

function ModalProfil() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    username: "",
    email: "",
    no_hp: "",
  });

  useEffect(() => {
    if (isOpen) {
      const fetchUserData = async () => {
        try {
          const response = await fetch("/api/update-user");
          const data = await response.json();
          if (data.success) {
            setFormData({
              first_name: data.user.first_name || "",
              last_name: data.user.last_name || "",
              username: data.user.username || "",
              email: data.user.email || "",
              no_hp: data.user.no_hp || "",
            });
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };
      fetchUserData();
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });
    setLoading(true);

    try {
      const response = await fetch("/api/update-user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({
          type: "success",
          text: data.message || "Profil berhasil diperbarui!",
        });
        
        // Simpan ke sessionStorage juga agar komponen lain (seperti ProfilPengguna) terupdate
        const currentSessionUser = JSON.parse(sessionStorage.getItem("user") || "{}");
        const updatedSessionUser = {
          ...currentSessionUser,
          full_name: data.user.full_name,
          email: data.user.email,
          username: data.user.username,
          no_hp: data.user.no_hp,
        };
        sessionStorage.setItem("user", JSON.stringify(updatedSessionUser));
        
        // Refresh page or trigger state update in parent if needed
        // For now, we just keep the form data updated from response
        setFormData({
          first_name: data.user.first_name || "",
          last_name: data.user.last_name || "",
          username: data.user.username || "",
          email: data.user.email || "",
          no_hp: data.user.no_hp || "",
        });
        window.location.reload();
      } else {
        setMessage({
          type: "error",
          text: data.message || "Gagal memperbarui profil.",
        });
      }
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Terjadi kesalahan koneksi.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={() => setIsOpen(true)}>
        <ChevronRight
          className="text-black dark:text-white"
          width={24}
          height={24}
        />
      </button>
      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100">
              <h2 className="text-xl font-bold text-black">
                Ganti Profil Pengguna
              </h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Scrollable Form Area */}
            <div className="max-height-[80vh] overflow-y-auto">
              <form
                onSubmit={handleSubmit}
                className="p-4 flex flex-col gap-6 w-full"
              >
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="first_name"
                    className="text-sm font-semibold text-gray-700 uppercase"
                  >
                    Nama Depan
                  </label>

                  <input
                    type="text"
                    name="first_name"
                    id="first_name"
                    placeholder="Contoh: Budi"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 text-black font-reguler placeholder:text-gray-400"
                    value={formData.first_name}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="last_name"
                    className="text-sm font-semibold text-gray-700 uppercase"
                  >
                    Nama Belakang
                  </label>

                  <input
                    type="text"
                    name="last_name"
                    id="last_name"
                    placeholder="Contoh: Santoso"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 text-black font-reguler placeholder:text-gray-400"
                    value={formData.last_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="email"
                    className="text-sm font-semibold text-gray-700 uppercase"
                  >
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    placeholder="Contoh: [EMAIL_ADDRESS]"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 text-black font-reguler placeholder:text-gray-400"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="username"
                    className="uppercase text-gray-700 font-semibold text-sm"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    name="username"
                    id="username"
                    placeholder="Contoh: 08123456789"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 text-black font-reguler placeholder:text-gray-400"
                    value={formData.username}
                    onChange={handleChange}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="no_hp"
                    className="uppercase text-gray-700 font-semibold text-sm"
                  >
                    No. Handphone
                  </label>
                  <input
                    type="text"
                    name="no_hp"
                    id="no_hp"
                    placeholder="Contoh: 08123456789"
                    className="w-full p-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all bg-gray-50 text-black font-reguler placeholder:text-gray-400"
                    value={formData.no_hp}
                    onChange={handleChange}
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-black hover:bg-black/90 text-white font-bold py-2 px-4 rounded-2xl shadow-xl transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? "Menyimpan..." : "Simpan Profil"}
                  </button>
                </div>

                {message.text && (
                  <div
                    className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-medium animate-in slide-in-from-top-2 duration-300 ${
                      message.type === "error"
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : "bg-green-50 text-green-600 border border-green-100"
                    }`}
                  >
                    {message.type === "error" ? (
                      <AlertCircle className="w-5 h-5 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                    )}
                    {message.text}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
