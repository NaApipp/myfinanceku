"use client";

import { useState } from "react";

import Link from "next/link";



export default function RegistrasiForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null); 

  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    username: '',
    no_hp: '',
    level: 'basic',
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Gagal mendaftar');
      }

      setMessage({ type: 'success', text: 'Registrasi berhasil! Silakan login.' });
      setFormData({ first_name: '', last_name: '', email: '', password: '', username: '', no_hp: '', level: 'basic' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
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
            Daftar Akun
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sudah punya akun?{" "}
            <Link
              className="text-sm font-semibold text-black hover:underline"
              href="/login"
            >
              Masuk
            </Link>
          </p>
          {message && (
          <div
            className={`rounded-lg p-4 text-sm mt-4 ${
              message.type === 'success'
                ? 'p-4 rounded-lg bg-green-50 border border-green-200 dark:bg-green-900/30 dark:border-green-800 text-green-800 dark:text-green-200 font-bold'
                : 'p-4 rounded-lg bg-red-50 border border-red-500 dark:bg-red-900/100 dark:border-red-800 text-white font-bold'
            }`}
          >
            {message.text}
          </div>
        )}
          <form className="mt-8" onSubmit={handleSubmit}>
            <div className="space-y-5">
              {/* Container Nama Depan dan Nama Belakang */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-base font-medium text-gray-900">
                    Nama Depan
                  </label>
                  <div className="mt-2">
                    <input
                    value={formData.first_name}
                    onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                      placeholder="Nama Depan"
                      type="text"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 text-black "
                    />
                  </div>
                </div>
                <div>
                  <label className="text-base font-medium text-gray-900">
                    Nama Belakang
                  </label>
                  <div className="mt-2">
                    <input
                    value={formData.last_name}
                    onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                      placeholder="Nama Belakang"
                      type="text"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 text-black"
                    />
                  </div>
                </div>
              </div>
              {/* Container Email Dan No Hp */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-base font-medium text-gray-900">
                    Email
                  </label>
                  <div className="mt-2">
                    <input
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="Email"
                      type="email"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 text-black"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-base font-medium text-gray-900">
                    No Hp 
                  </label>
                  <div className="mt-2">
                    <input
                    value={formData.no_hp}
                    onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}

                      placeholder="No Hp"
                      type="text"
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 text-black"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="text-base font-medium text-gray-900">
                  Username
                </label>
                <div className="mt-2">
                  <input
                  value={formData.username}
                    onChange={(e) => setFormData({ ...formData,   username: e.target.value })}
                    placeholder="Username"
                    type="text"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 text-black"
                  />
                </div>
              </div>
              <div>
                <label className="text-base font-medium text-gray-900 hidden">
                  Level
                </label>
                <div className="mt-2">
                  <input
                  value={formData.level}
                    onChange={(e) => setFormData({ ...formData,   level: e.target.value })}
                    placeholder="Username"
                    type="text"
                    className="hidden flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50 text-black"
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
                  {isLoading ? 'Memproses...' : 'Daftarkan Akun'}
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
              Daftar Dengan Google
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
