"use client";

import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";


export default function LoginForm() {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/login", {
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
        sessionStorage.setItem("user", JSON.stringify(result.user));

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
    <section>
      <div className="flex bg-white items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-8 min-h-screen">
        <div className="xl:mx-auto xl:w-full shadow-md p-4 xl:max-w-sm 2xl:max-w-md">
          <div className="mb-2 flex justify-center" />
          <h2 className="text-center text-2xl font-bold leading-tight text-black">
            Masuk
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Belum punya akun?{" "}
            <Link
              className="text-sm font-semibold text-black hover:underline"
              href="/registrasi"
            >
              Daftar
            </Link>
          </p>
          <form className="mt-8" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <label className="text-base font-medium text-gray-900">
                  Username
                </label>
                <div className="mt-2">
                  <input
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                    placeholder="Username"
                    type="text"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 text-black"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-base font-medium text-gray-900">
                    Password
                  </label>
                  <Link
                    className="text-sm font-semibold text-black hover:underline hidden"
                    href="#"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="mt-2">
                  <input
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Password"
                    type="password"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 text-black"
                  />
                </div>
              </div>
              <div>
                <button
                  className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                  type="submit"
                >
                  {isLoading ? "Memproses..." : "Masuk"}
                </button>
              </div>
            </div>
          </form>
          <div className="mt-3 space-y-3">
            <button
              className="relative inline-flex w-full items-center justify-center rounded-md border border-gray-400 bg-white px-3.5 py-2.5 font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-100 hover:text-black focus:bg-gray-100 focus:text-black focus:outline-none"
              type="button"
            >
              <span className="mr-2 inline-block">
                <svg
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-rose-500"
                >
                  <path d="M20.283 10.356h-8.327v3.451h4.792c-.446 2.193-2.313 3.453-4.792 3.453a5.27 5.27 0 0 1-5.279-5.28 5.27 5.27 0 0 1 5.279-5.279c1.259 0 2.397.447 3.29 1.178l2.6-2.599c-1.584-1.381-3.615-2.233-5.89-2.233a8.908 8.908 0 0 0-8.934 8.934 8.907 8.907 0 0 0 8.934 8.934c4.467 0 8.529-3.249 8.529-8.934 0-.528-.081-1.097-.202-1.625z" />
                </svg>
              </span>
              Login Dengan Google
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
