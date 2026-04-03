"use client";

import {
  Wallet,
  ClockFading,
  ChartPie,
  Target,
  Settings,
  House,
  Plus,
  SquareArrowRightExit,
} from "lucide-react";
import Link from "next/link";

import { useRouter } from "next/navigation";

import { usePathname } from "next/navigation";

import TambahTransaksi from "./TambahTransaksi";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  //   Handle Logout
  const handleLogout = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.removeItem("user");
    router.push("/login");
  };

  // Path Active Logic
  const getPathActive = (href: string) => {
    const isActive = pathname === href;
    return `flex items-center gap-2 rounded-lg px-4 py-2 transition-all  ${
      isActive 
        ? "text-black bg-transparent font-bold"  
        : "text-gray-500 hover:bg-black hover:text-white font-bold"
    }`;
   };

  return (
    <div className="flex h-screen w-64 flex-col justify-between border-e bg-[#FAFAFA] border-gray-200">
      <div className="px-4 py-6">
        <span className="flex items-center gap-1 ml-4 text-lg text-gray-700 dark:text-gray-200">
          <Wallet className="text-lime-500" />
          <span className="font-semibold text-black">MyFinanceKu</span>
        </span>

        <ul className="mt-6 space-y-1">
          <li>
            <Link
              href="/dashboard"
              className={getPathActive("/dashboard")}
            >
              <House />

              <span className="text-sm font-medium"> General </span>
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/transaksi"
              className={getPathActive("/dashboard/transaksi")}
            >
              <ClockFading />

              <span className="text-sm font-medium"> Transaksi </span>
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/akun-kartu"
              className={getPathActive("/dashboard/akun-kartu")}
            >
              <Wallet />

              <span className="text-sm font-medium"> Akun & Kartu </span>
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/anggaran"
              className={getPathActive("/dashboard/anggaran")}
            >
              <ChartPie />

              <span className="text-sm font-medium"> Anggaran </span>
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/target"
              className={getPathActive("/dashboard/target")}
            >
              <Target />

              <span className="text-sm font-medium"> Target </span>
            </Link>
          </li>

          <li>
            <Link
              href="/dashboard/pengaturan"
              className={getPathActive("/dashboard/pengaturan")}
            >
              <Settings />

              <span className="text-sm font-medium"> Pengaturan </span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t bg-white p-2 border-gray-200">
        {/* Button add new  Transaksi */}
        <TambahTransaksi />
        {/* Handle Logout */}
        <form onSubmit={handleLogout}>
          <button
            type="submit"
            className="group relative flex w-full h-10 items-center gap-2 justify-center rounded-lg px-2 py-1.5 text-sm bg-black text-white cursor-pointer hover:bg-black/70 hover:text-white transition-all"
          >
            <SquareArrowRightExit width={16} height={16} />

            <span className="text-sm font-bold">Keluar</span>
          </button>
        </form>
      </div>
    </div>
  );
}
