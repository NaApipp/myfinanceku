"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Wallet,
  CreditCard,
  Building2,
  Smartphone,
  Plus,
  MoreVertical,
  Banknote,
  Trash,
} from "lucide-react";

interface AccountData {
  idAccount: string;
  type_asset: string;
  nama_asset: string;
  saldo_awal: string;
  nama_akun: string;
}

export default function DataAccoundCard() {
  const [data, setData] = useState<AccountData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("/api/account-card");
        const result = await response.json();
        if (result.success) {
          setData(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching account data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-48 bg-gray-100 animate-pulse rounded-[32px] border border-gray-200"
          />
        ))}
      </div>
    );
  }

  const handleDelete = async (idAccount: string) => {
    try {
      const response = await fetch(`/api/account-card/${idAccount}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setData((prev) => prev.filter((item) => item.idAccount !== idAccount));
      }
      // Reload After Delete
      window.location.reload();
    } catch (error) {
      console.error("Error fetching account data:", error);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="flex flex-col gap-8 mt-8">
      {/* Summary Card */}

      {/* Asset List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => (
          <div
            key={item.idAccount}
            className="group relative bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden"
          >
            <div className="flex justify-between items-start mb-6">
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center border border-gray-100 shadow-sm ${item.type_asset === "bank" ? "bg-blue-50" : "bg-purple-50"}`}
              >
                {item.type_asset === "bank" ? (
                  <Building2 className="w-6 h-6 text-blue-600" />
                ) : (
                  <Smartphone className="w-6 h-6 text-purple-600" />
                )}
              </div>
              <button onClick={() => handleDelete(item.idAccount)} className="p-2 text-gray-400 hover:text-red-800 transition-colors">
                <Trash className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-1">
              <p className="text-black text-xl font-extrabold uppercase tracking-widest">
                {item.nama_asset}
              </p>
              <h3 className="text-xs font-bold text-gray-400 truncate">
                {item.nama_akun}
              </h3>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-50 flex items-end justify-between">
              <div>
                <p className="text-gray-400 text-black text-[10px] uppercase font-bold tracking-tight mb-1">
                  Saldo Tersedia
                </p>
                <p className="text-2xl font-black text-black tracking-tight">
                  {formatCurrency(item.saldo_awal)}
                </p>
              </div>
              <div className="p-2 bg-gray-50 rounded-full group-hover:bg-black group-hover:text-white transition-all duration-300">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}

        {/* Add Empty State / CTA if no data */}
        {data.length === 0 && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-[40px] bg-gray-50/50">
            <div className="p-6 bg-white rounded-full shadow-sm mb-4">
              <CreditCard className="w-10 h-10 text-gray-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Belum ada aset</h3>
            <p className="text-gray-500 max-w-xs text-center mt-2">
              Daftarkan akun bank atau e-wallet Anda untuk mulai memantau
              keuangan.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
