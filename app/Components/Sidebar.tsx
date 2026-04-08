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
        ? "text-black dark:text-white bg-transparent font-bold"
        : "text-gray-500 dark:text-gray-400 hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black font-bold"
    }`;
  };

  return (
    <div className="flex h-screen w-64 flex-col justify-between border-e bg-[#FAFAFA] dark:bg-neutral-950 border-gray-200 dark:border-white/5 transition-colors duration-300">
      <div className="px-4 py-6">
        <span className="flex items-center gap-1 ml-4 text-lg text-gray-700 dark:text-gray-200">
          <Wallet className="text-lime-500" />
          <span className="font-semibold text-black dark:text-white">
            MyFinanceKu
          </span>
        </span>

        <ul className="mt-6 space-y-1">
          <li>
            <Link href="/general" className={getPathActive("/general")}>
              <House />

              <span className="text-sm font-medium"> General </span>
            </Link>
          </li>

          <li>
            <Link
              href="/transaksi"
              className={getPathActive("/transaksi")}
            >
              <ClockFading />

              <span className="text-sm font-medium"> Transaksi </span>
            </Link>
          </li>

          <li>
            <Link
              href="/akun-kartu"
              className={getPathActive("/akun-kartu")}
            >
              <Wallet />

              <span className="text-sm font-medium"> Akun & Kartu </span>
            </Link>
          </li>

          <li>
            <Link
              href="/anggaran"
              className={getPathActive("/anggaran")}
            >
              <ChartPie />

              <span className="text-sm font-medium"> Anggaran </span>
            </Link>
          </li>

          <li>
            <Link
              href="/target"
              className={getPathActive("/target")}
            >
              <Target />

              <span className="text-sm font-medium"> Target </span>
            </Link>
          </li>

          <li>
            <Link
              href="/pengaturan"
              className={getPathActive("/pengaturan")}
            >
              <Settings />

              <span className="text-sm font-medium"> Pengaturan </span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t bg-white dark:bg-neutral-950 p-2 border-gray-200 dark:border-white/5 transition-colors duration-300">
        {/* Button add new  Transaksi */}
        <TambahTransaksi />
        {/* Handle Logout */}
        <form onSubmit={handleLogout}>
          <button
            type="submit"
            className="group relative flex w-full h-10 items-center gap-2 justify-center rounded-lg px-2 py-1.5 text-sm bg-black dark:bg-white text-white dark:text-black cursor-pointer hover:bg-black/70 dark:hover:bg-white/70 hover:text-white dark:hover:text-black transition-all"
          >
            <SquareArrowRightExit width={16} height={16} />

            <span className="text-sm font-bold">Keluar</span>
          </button>
        </form>
      </div>
    </div>
  );
}
