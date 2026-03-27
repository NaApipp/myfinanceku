import { Wallet, ClockFading, ChartPie, Target, Settings, House } from "lucide-react";
import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="flex h-screen w-64 flex-col justify-between border-e bg-white dark:border-gray-800 dark:bg-gray-900">
      <div className="px-4 py-6">
        <span className="flex items-center gap-1 ml-4 text-lg text-gray-700 dark:text-gray-200">
          <Wallet className="text-lime-500" />
          <span className="font-semibold">MyFinanceKu</span>
        </span>

        <ul className="mt-6 space-y-1">
          <li>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 dark:bg-gray-800 dark:text-gray-200"
            >
              <House />

              <span className="text-sm font-medium"> General </span>
            </Link>
          </li>

          <li>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              <ClockFading />

              <span className="text-sm font-medium"> Transaksi </span>
            </Link>
          </li>

          <li>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              <Wallet />

              <span className="text-sm font-medium"> Akun & Kartu </span>
            </Link>
          </li>

          <li>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              <ChartPie />

              <span className="text-sm font-medium"> Anggaran </span>
            </Link>
          </li>

          <li>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              <Target />

              <span className="text-sm font-medium"> Target </span>
            </Link>
          </li>

          <li>
            <Link
              href="#"
              className="flex items-center gap-2 rounded-lg px-4 py-2 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
            >
              <Settings />

              <span className="text-sm font-medium"> Pengaturan </span>
            </Link>
          </li>
        </ul>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2 dark:border-gray-800 dark:bg-gray-900">
        <form action="#">
          <button
            type="submit"
            className="group relative flex w-full gap-2 justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="size-5 opacity-75"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>

            <span className="text-sm font-bold">Keluar</span>
          </button>
        </form>
      </div>
    </div>
  );
}
