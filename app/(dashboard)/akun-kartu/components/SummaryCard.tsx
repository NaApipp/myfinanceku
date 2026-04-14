"use client";

import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";

interface AccountData {
  idAccount: string;
  type_asset: string;
  nama_asset: string;
  saldo_awal: string;
  nama_akun: string;
}

export default function SummaryCard() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AccountData[]>([]);

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

  //   Forat Currency
  const formatCurrency = (amount: string) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(Number(amount));
  };

  //   Format Tptal Balance
  const totalBalance = data.reduce(
    (acc, curr) => acc + Number(curr.saldo_awal),
    0,
  );

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

  const totalAsset = data.length;
  return (
    <div className="relative overflow-hidden bg-black dark:bg-neutral-900 border border-white/5 p-8 rounded-[40px] shadow-2xl text-white group">
      <div className="absolute top-0 right-0 p-8">
        <div className="p-4 bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 group-hover:scale-110 transition-transform duration-500 hidden md:block">
          <Wallet className="w-8 h-8 text-white" />
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-white/50 text-sm font-medium uppercase tracking-[0.2em] mb-2">
          Total Kepemilikan Dana
        </p>
        <h2 className="text-5xl font-black tracking-tighter mb-6">
          {formatCurrency(totalBalance.toString())}
        </h2>

        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-white/40 text-xs uppercase font-bold tracking-wider">
              Total Aset
            </span>
            <span className="text-xl font-bold">
              {data.length}{" "}
              <span className="text-sm font-normal text-white/50">Aset</span>
            </span>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/5 via-transparent to-transparent opacity-50" />
    </div>
  );
}
