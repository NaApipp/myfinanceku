"use client"

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Sun, 
  Moon, 
  Wallet, 
  ClockFading, 
  ChartPie, 
  Target, 
  House, 
  Settings, 
  SquareArrowRightExit 
} from "lucide-react";
import { usePathname } from "next/navigation";
import TambahTransaksi from "./TambahTransaksi";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const close = () => setOpen(false);

  // Path Active Logic (synchronized with Sidebar)
  const getPathActive = (href: string) => {
    const isActive = pathname === href;
    return `animasi-navbar flex items-center gap-3 py-3 px-4 rounded-2xl transition-all ${
      isActive
        ? "text-black dark:text-white bg-gray-100 dark:bg-white/10 font-bold"
        : "text-gray-500 dark:text-gray-400 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black font-medium"
    }`;
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
    <nav className="lg:hidden fixed inset-x-0 top-0 z-50 bg-[#FAFAFA] dark:bg-neutral-950 border-b border-gray-200 dark:border-white/5 transition-colors duration-300">
      {/* bar atas */}
      <div className="max-w-screen-xl mx-auto flex h-16 items-center justify-between px-4 relative z-50">
        <Link href="/general" onClick={close} className="flex items-center space-x-3 rtl:space-x-reverse">
          <img
            src="/icon/logo.png"
            className="h-11"
            alt="Logo"
          />
          <span className="self-center text-xl text-black dark:text-white font-poppins font-bold whitespace-nowrap tracking-tight">
            MyFinanceKu
          </span>
        </Link>

        <div className="flex items-center gap-4 hidden">
          <ToggleTheme />
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-gray-500 dark:text-gray-400 rounded-xl hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none transition-colors duration-300"
          aria-controls="navbar-solid"
          aria-expanded={open}
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className="w-6 h-6"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="2"
              d="M5 7h14M5 12h14M5 17h14"
            />
          </svg>
        </button>

        {/* menu */}
        <div
          id="navbar-solid"
          className={`
            ${open ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0 pointer-events-none"}
            absolute top-16 left-0 right-0 z-40
            bg-[#FAFAFA] dark:bg-neutral-950 border-b border-gray-200 dark:border-white/5
            transition-all duration-300 ease-in-out
            p-4 space-y-4
          `}
        >
          <ul className="flex flex-col gap-1">
            <li>
              <Link href="/general" onClick={close} className={getPathActive("/general")}>
                <House size={20} />
                <span>General Dashboard</span>
              </Link>
            </li>
            <li>
              <Link href="/transaksi" onClick={close} className={getPathActive("/transaksi")}>
                <ClockFading size={20} />
                <span>Riwayat Transaksi</span>
              </Link>
            </li>
            <li>
              <Link href="/akun-kartu" onClick={close} className={getPathActive("/akun-kartu")}>
                <Wallet size={20} />
                <span>Akun & Kartu</span>
              </Link>
            </li>
            <li>
              <Link href="/anggaran" onClick={close} className={getPathActive("/anggaran")}>
                <ChartPie size={20} />
                <span>Anggaran</span>
              </Link>
            </li>
            <li>
              <Link href="/target" onClick={close} className={getPathActive("/target")}>
                <Target size={20} />
                <span>Target Tabungan</span>
              </Link>
            </li>
            <li>
              <Link href="/pengaturan" onClick={close} className={getPathActive("/pengaturan")}>
                <Settings size={20} />
                <span>Pengaturan</span>
              </Link>
            </li>
          </ul>

          <div className="pt-4 border-t border-gray-200 dark:border-white/10 space-y-3">
            <TambahTransaksi />
            
            <form onSubmit={handleLogout}>
              <button
                type="submit"
                className="flex w-full items-center gap-3 justify-center py-4 rounded-2xl bg-red-500/10 text-red-500 font-bold hover:bg-red-500/20 transition-all"
              >
                <SquareArrowRightExit size={20} />
                <span>Keluar dari Akun</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </nav>
  );
}

function ToggleTheme() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Check initial theme or system preference
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.classList.toggle("dark", savedTheme === "dark");
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };

  return (
    <div className="flex bg-gray-100 dark:bg-white/5 rounded-2xl p-1 w-full max-w-[200px] mx-auto shadow-inner">
      <button
        onClick={() => toggleTheme("light")}
        className={`flex flex-1 items-center justify-center gap-2 py-2.5 px-4 rounded-xl transition-all duration-300 ${
          theme === "light"
            ? "bg-white text-black shadow-lg"
            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        }`}
      >
        <Sun size={18} className={theme === "light" ? "text-yellow-500" : ""} />
      </button>
      <button
        onClick={() => toggleTheme("dark")}
        className={`flex flex-1 items-center justify-center gap-2 py-2.5 px-4 rounded-xl transition-all duration-300 ${
          theme === "dark"
            ? "bg-white/10 dark:bg-white/20 text-black dark:text-white shadow-lg"
            : "text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        }`}
      >
        <Moon size={18} className={theme === "dark" ? "text-blue-400" : ""} />
      </button>
    </div>
  );
}