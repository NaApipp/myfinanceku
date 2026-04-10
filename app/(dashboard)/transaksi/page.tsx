"use client";

import DataTransaksi from "./components/DataTransaksi";

export default function Page() {
  return (
    <div className="min-h-screen p-4 bg-[#F5F5F5] dark:bg-black transition-colors duration-300">
      <div className="">
        <h1 className="text-black dark:text-white font-black text-4xl tracking-tight">Transaksi</h1>
        <p className="text-[#777777] dark:text-gray-400 text-sm">
          Daftar semua pemasukan dan pengeluaran Anda.
        </p>
      </div>
      <div className="mt-8">
        <DataTransaksi />
      </div>
    </div>
  );
}
