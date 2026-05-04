"use client";
import {
  Calendar,
  ClipboardList,
  DatabaseBackup,
  Edit,
  Mail,
  Phone,
  Plus,
  Search,
  User,
  Wallet,
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { da } from "zod/locales";

interface TransaksiData {
  userId: string;
  createdAt: string;
  tanggal_transaksi: string;
  idAccount: string;
  idTransaksi: string;
  nominal_transaksi: number;
  type_transaksi: string;
  kategori: string;
}

export default function ClientView() {
  const [data, setData] = useState<TransaksiData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchTransaksi = async () => {
      try {
        const response = await fetch("/api/admin/transaksi");
        const result = await response.json();
        if (result.success) {
          setData(result.data);
        }
      } catch (error) {
        console.error("Error fetching transaksi data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTransaksi();
  }, []);

  const getStyleType = (type: string) => {
    if (type === "pemasukan")
      return "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-200 dark:border-green-800";
    if (type === "pengeluaran")
      return "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-800";
    return "bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-800";
  };

  const filteredData = data
    .filter((item) => {
      const search = searchTerm.toLowerCase();
      return (
        item.idAccount?.toLowerCase().includes(search) ||
        item.idTransaksi?.toLowerCase().includes(search) ||
        item.type_transaksi?.toLowerCase().includes(search) ||
        item.userId?.toLowerCase().includes(search)
      );
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return (
    <div className="overflow-x-auto p-5">
      {/* Header & Filter Section */}
      <div className="flex flex-col md:flex-row items-center justify-between mb-5 gap-3">
        {/* Left Section: Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold text-gray-700 dark:text-gray-200">
            Transaksi
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Pantau Transaksi User by All Accounts
          </p>
        </div>

        {/* Right Section Filter */}
        <div className="flex items-center gap-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari transaksi..."
            className="p-3 text-sm bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full md:w-64"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              Id Account
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              Id Transaksi
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              Nominal Transaksi
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              Type Transaksi
            </th>
            <th className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-widest">
              Kategori
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50 dark:divide-gray-700/50">
          {loading ? (
            Array.from({ length: 100 }).map((_, i) => (
              <tr key={i} className="animate-pulse">
                <td className="px-6 py-4">
                  <div className="h-10 w-40 bg-gray-100 dark:bg-gray-700 rounded-xl" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-10 w-48 bg-gray-100 dark:bg-gray-700 rounded-xl" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-10 w-32 bg-gray-100 dark:bg-gray-700 rounded-xl" />
                </td>
                <td className="px-6 py-4">
                  <div className="h-8 w-20 bg-gray-100 dark:bg-gray-700 rounded-full" />
                </td>
              </tr>
            ))
          ) : filteredData.length > 0 ? (
            filteredData.map((item) => (
                <tr
                  key={item.createdAt}
                  className="group hover:bg-gray-50/80 dark:hover:bg-gray-700/30 transition-all duration-200"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                        {item.idAccount?.charAt(0) || "A"}
                      </div>
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                          <Mail className="w-3.5 h-3.5 text-indigo-400" />
                          {item.idAccount || "-"}
                        </div>
                        {item.userId && (
                          <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                            <User className="w-3.5 h-3.5" />
                            {item.userId}
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                        <Mail className="w-3.5 h-3.5 text-indigo-400" />
                        {item.idTransaksi || "-"}
                      </div>
                      {item.createdAt && (
                        <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(item.createdAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 font-medium tracking-tight">
                      <Wallet className="w-4 h-4 text-gray-400" />
                      Rp.{item.nominal_transaksi}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={
                        `inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ` +
                        getStyleType(item.type_transaksi)
                      }
                    >
                      {item.type_transaksi}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border`}
                    >
                      {item.kategori || "-"}
                    </span>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan={5} className="px-6 py-16 text-center">
                <div className="flex flex-col items-center gap-2 opacity-50">
                  <ClipboardList className="w-12 h-12 text-gray-300" />
                  <p className="text-gray-500 dark:text-gray-400 font-medium">
                    Belum ada data pengaduan.
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
