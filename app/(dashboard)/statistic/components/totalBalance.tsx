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

export default function TotalBalance() {
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
  const month = new Date().toLocaleDateString('id-ID', {
    month: 'long',
  });
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-all duration-300 group">
      <div>
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
          Total Kepemilikan Dana
        </p>
        <h4 className="text-2xl font-black text-black dark:text-white tracking-tight transition-transform duration-300 group-hover:scale-[1.02] origin-left">
          {formatCurrency(totalBalance.toString())}
        </h4>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 block font-medium">
          Bulan
          <span className="font-bold text-black dark:text-white mx-1">
            {month}
          </span>
        </span>
      </div>
      <div className="w-12 h-12 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-2xl flex items-center justify-center border border-emerald-100/50 dark:border-emerald-500/10 shadow-sm transition-transform duration-300 group-hover:scale-110">
        <Wallet className="w-6 h-6" />
      </div>
    </div>
  );
}
