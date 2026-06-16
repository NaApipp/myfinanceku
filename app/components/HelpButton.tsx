"use client"; // hapus baris ini jika pakai Pages Router

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation"; // pakai useRouter jika Pages Router
import Link from "next/link";
import { Calculator, CircleQuestionMark } from "lucide-react";
import CalculatorModal from "./calculator/CalculatorModal";

// Konten panduan per halaman

const defaultGuide = {
  title: "Panduan Umum",
  steps: [
    {
      title: "Navigasi sidebar",
      desc: "Gunakan menu di sebelah kiri untuk berpindah antar fitur.",
    },
    {
      title: "Tambah transaksi",
      desc: 'Tombol "+ Tambah Transaksi" tersedia di hampir semua halaman.',
    },
    {
      title: "Butuh bantuan lebih?",
      desc: "Kunjungi Pengaturan → Bantuan → Pusat Bantuan untuk panduan lengkap.",
    },
  ],
  tip: "Kamu bisa mengakses panduan ini kapan saja dari tombol ? di pojok kanan bawah.",
};

export default function HelpButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCalcOpen, setIsCalcOpen] = useState(false);
  const pathname = usePathname();

  // Tutup modal saat pindah halaman
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Tutup dengan tombol Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      {/* Menu Popover Bantuan */}
      {isOpen && (
        <div className="fixed bottom-[80px] right-[24px] bg-white dark:bg-gray-800 rounded-xl shadow-lg w-[260px] z-50 overflow-hidden border border-gray-200 dark:border-gray-700">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 dark:text-white text-sm">
              Pusat Bantuan
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              ✕
            </button>
          </div>
          <div className="p-2 flex flex-col gap-1">
            <Link
              href="pengaturan/panduan-penggunaan"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 transition-colors"
            >
              <CircleQuestionMark
                className="text-black dark:text-white mr-3"
                width={24}
                height={24}
              /> Panduan Umum
            </Link>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault();
                setIsOpen(false);
                setIsCalcOpen(true);
              }}
              className="flex items-center px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 transition-colors"
            >
              <Calculator
                className="text-black dark:text-white mr-3"
                width={24}
                height={24}
              /> Kalkulator
            </Link>
            <Link
              href="https://discord.gg/FUeeHJWU9c"
              target="_blank"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-3 py-2.5 hover:bg-blue-50 dark:hover:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-200 transition-colors"
            >
              <span className="mr-3 text-lg">
                {" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  className="fill-black dark:fill-white"
                >
                  <path d="M19.888 7.335a5.134 5.134 0 0 0-2.893-2.418a9.144 9.144 0 0 0-2.275-.508a9.963 9.963 0 0 0-.508 1.038a15.039 15.039 0 0 0-4.56 0a11.372 11.372 0 0 0-.519-1.038c-.752.082-1.493.249-2.208.497a5.123 5.123 0 0 0-2.904 2.44a16.176 16.176 0 0 0-1.91 9.717a16.562 16.562 0 0 0 4.98 2.528a4.339 4.339 0 0 0 1.104-1.777c-.54-.202-1.06-.45-1.557-.74c-.089-.122.254-.32.364-.354a11.826 11.826 0 0 0 10.037 0c.1 0 .453.232.364.354c-.441.342-1.424.585-1.59.828a7.4 7.4 0 0 0 1.105 1.69a16.628 16.628 0 0 0 4.99-2.53a16.232 16.232 0 0 0-2.02-9.727M8.669 14.7a1.943 1.943 0 0 1-1.92-1.955a1.943 1.943 0 0 1 1.92-1.91a1.942 1.942 0 0 1 1.933 1.965a1.943 1.943 0 0 1-1.933 1.9m6.625 0a1.943 1.943 0 0 1-1.932-1.944a1.932 1.932 0 1 1 3.865.034a1.932 1.932 0 0 1-1.933 1.899z" />
                </svg>
              </span>{" "}
              Hubungi Support Center
            </Link>
          </div>
        </div>
      )}

      {/* Tombol ? mengambang */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Tutup panduan" : "Buka panduan penggunaan"}
        title={isOpen ? "Tutup panduan" : "Buka panduan penggunaan"}
        className={`fixed bottom-6 right-6 w-11 h-11 rounded-full text-white shadow-lg flex items-center justify-center text-xl font-semibold cursor-pointer z-50 transition-all duration-200 hover:scale-105 active:scale-95 ${isOpen ? "bg-gray-600 dark:bg-gray-700" : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700"}`}
      >
        {isOpen ? "✕" : "?"}
      </button>

      <CalculatorModal isOpen={isCalcOpen} onClose={() => setIsCalcOpen(false)} />
    </>
  );
}
