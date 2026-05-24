"use client";

import { LayoutGrid, Pencil, BarChart3, Target } from "lucide-react";

import TambahTransaksi from "../panduan/TambahTransaksi";
import AkunKartu from "../panduan/AkunKartu";
import TargetTab from "../panduan/Target";
import Anggaran from "../panduan/Anggaran";
import Kategori from "../panduan/Kategori";
import CadangkanData from "../panduan/CadangkanData";

export default function PanduanPenggunaan() {
  const cards = [
    {
      icon: <LayoutGrid className="w-5 h-5 text-indigo-400" />,
      iconBg: "bg-indigo-400/10",
      title: "Dashboard",
      description: "Cara membaca ringkasan dan memahami angka di halaman utama",
      borderClass: "border-indigo-500/40",
    },
    {
      icon: <Pencil className="w-5 h-5 text-teal-400" />,
      iconBg: "bg-teal-400/10",
      title: "Catat transaksi",
      description: "Cara menambahkan pemasukan dan pengeluaran harian",
      borderClass: "border-zinc-800 hover:border-zinc-700",
    },
    {
      icon: <BarChart3 className="w-5 h-5 text-blue-400" />,
      iconBg: "bg-blue-400/10",
      title: "Laporan & grafik",
      description: "Cara membaca grafik dan filter laporan keuangan",
      borderClass: "border-zinc-800 hover:border-zinc-700",
    },
    {
      icon: <Target className="w-5 h-5 text-amber-400" />,
      iconBg: "bg-amber-400/10",
      title: "Target & anggaran",
      description: "Cara membuat target tabungan dan mengatur batas pengeluaran",
      borderClass: "border-zinc-800 hover:border-zinc-700",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* {cards.map((card, index) => (
        <div
          key={index}
          className={`p-6 rounded-2xl bg-[#1c1c1e] border ${card.borderClass} cursor-pointer transition-colors`}
        >
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${card.iconBg}`}>
            {card.icon}
          </div>
          <h3 className="text-white font-bold text-base mb-1">{card.title}</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            {card.description}
          </p>
        </div>
      ))} */}
      <TambahTransaksi />
      <AkunKartu />
      <TargetTab />
      <Anggaran />
      <Kategori />
      <CadangkanData />
    </div>
  );
}