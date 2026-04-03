"use client";

import { Lock, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Keamanan() {
  return (
    <div className=" p-4 rounded-lg px-0">
      <h1 className="text-black dark:text-white font-bold text-2xl mb-6">Keamanan</h1>

      <div className="text-black dark:text-white flex flex-row justify-between items-center bg-white dark:bg-neutral-900 rounded-[32px] shadow-md p-8 border border-gray-100 dark:border-white/5 transition-colors duration-300">
        {/* icon & text */}
        <div className="flex flex-row items-center gap-4">
          <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl">
            <Lock className="text-black dark:text-white" width={24} height={24} />
          </div>
          <div className="">
            <h2 className="text-lg font-semibold">Ganti Kata Sandi</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Lakukan jika terjadi hal yang tidak diinginkan.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/pengaturan/ubah-password"
          className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
        >
          <ChevronRight className="text-black dark:text-white" width={24} height={24} />
        </Link>
      </div>
    </div>
  );
}
