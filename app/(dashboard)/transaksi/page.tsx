"use client";

import DataTransaksi from "./components/DataTransaksi";

export default function Page() {
  return (
    <div className="min-h-screen p-4 bg-[#F5F5F5]">
      <div className="">
        <h1 className="text-black font-bold text-[36px]">Transaksi</h1>
        <p className="text-[#777777] text-[18px]">
          Daftar semua pemasukan dan pengeluaran Anda.
        </p>
      </div>
      <div className="mt-8">
        <DataTransaksi />
      </div>
    </div>
  );
}
