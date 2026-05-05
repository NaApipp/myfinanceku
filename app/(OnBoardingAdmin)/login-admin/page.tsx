'use client';

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function page() {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const { name, value } = e.target;
  setFormData((prevData) => ({
    ...prevData,
    [name]: value,
  }));

  // Hapus pesan error jika user mulai mengetik lagi
  if (message) {
    setMessage(null);
  }
};

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("api/admin/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage({ type: "success", text: "Login berhasil! Mengalihkan..." });

        // Simpan data user ke sessionStorage
        sessionStorage.setItem("user-admin", JSON.stringify(result.user));

        // Set cookie untuk middleware Next.js route protection
        document.cookie = "isLoggedIn=true; path=/; max-age=86400";

        // Redirect berdasarkan response API
        setTimeout(() => {
          router.push(result.redirectTo || "/dashboard");
        }, 1000);
      } else {
        setMessage({
          type: "error",
          text: result.message || "Username atau password salah.",
        });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: "Gagal menghubungi server. Silakan coba lagi.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
<div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-12">
  <div className="max-w-md w-full">
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 bg-lime-100 dark:bg-lime-900/40 rounded-xl mb-4">
          <svg className="w-6 h-6 text-lime-600 dark:text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Selamat Datang</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Silahkan login untuk melanjutkan</p>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Email
          </label>
          <input
          value={formData.email}
          onChange={handleInputChange}
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-lime-500 dark:focus:border-lime-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="example@gmail.com"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
          </div>
          <div className="relative">
            <input
              value={formData.password}
              onChange={handleInputChange}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-lime-500 dark:focus:ring-lime-400 focus:border-lime-500 dark:focus:border-lime-400 outline-none transition-colors text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors focus:outline-none"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        
        {isLoading ? (
  <button
    type="button"
    disabled
    className="w-full bg-gray-300 dark:bg-gray-700 text-white py-3 px-4 rounded-lg cursor-not-allowed flex items-center justify-center"
  >
    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-400 mr-3"></div>
    Memproses...
  </button>
) : (
  <button
    type="submit"
    className="w-full bg-lime-600 dark:bg-lime-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-lime-700 dark:hover:bg-lime-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-lime-500 dark:focus:ring-offset-gray-800 transition-colors"
  >
    Masuk
  </button>
)}
      </form>

      <p className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        Belum punya akun?
        <span className="font-medium text-lime-600 dark:text-lime-400">
          Hubungi Admin
        </span>
      </p>
    </div>
  </div>
</div>
</>
  )
}