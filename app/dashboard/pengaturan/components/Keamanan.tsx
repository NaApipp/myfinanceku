"use client";

import { Lock, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function Keamanan() {
  return (
    <div className=" p-4 rounded-lg">
      <h1 className="text-black font-bold text-[20px] mb-4">Keamanan</h1>

      <div className="text-black flex flex-row justify-between items-center bg-white rounded-3xl shadow-md p-7">
        {/* icon & text */}
        <div className="flex flex-row items-center gap-3">
          <Lock className="text-black" width={24} height={24} />
          <div className="">
            <h2 className="text-[16px] font-semibold">Ganti Kata Sandi</h2>
            <p className="text-[12px] text-[#737373]">
              Lakukan jika terjadi hal yang tidak diinginkan.
            </p>
          </div>
        </div>
        <Link
          href="/dashboard/pengaturan/ubah-password"
          className="cursor-pointer"
        >
          <ChevronRight className="text-black" width={24} height={24} />
        </Link>
      </div>
    </div>
  );
}
