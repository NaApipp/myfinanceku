"use client";

import { useEffect, useState } from "react";
import { Banknote, TrendingUp } from "lucide-react";

interface TotalIncome {
  totalIncome: number;
}

export default function TotalIncome() {
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState<TotalIncome[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("/api/transaksi/total-income");
        const result = await response.json();
        if (result.success) {
          setTotal(result.data || []);
        }
      } catch (error) {
        console.error("Error fetching accounts:", error);
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

  const totalIncome = total.reduce(
    (acc, curr) => acc + Number(curr.totalIncome),
    0,
  );

  const month = new Date().toLocaleDateString('id-ID', {
    month: 'long',
  });

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-[32px] p-6 border border-gray-100 dark:border-white/5 animate-pulse h-28 flex items-center justify-between transition-colors">
        <div className="flex flex-col gap-2">
          <div className="h-4 w-28 bg-gray-100 dark:bg-white/5 rounded"></div>
          <div className="h-6 w-36 bg-gray-100 dark:bg-white/5 rounded"></div>
        </div>
        <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm p-6 flex items-center justify-between hover:shadow-md transition-all duration-300 group">
      <div>
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
          Total Pemasukan
        </p>
        <h4 className="text-2xl font-black text-black dark:text-white tracking-tight transition-transform duration-300 group-hover:scale-[1.02] origin-left">
          {formatCurrency(totalIncome.toString())}
        </h4>
        <span className="text-[10px] text-gray-400 dark:text-gray-500 mt-1 block font-medium">Bulan
          <span className="font-bold text-black dark:text-white mx-1">{month}</span>
        </span>
      </div>
      <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-2xl flex items-center justify-center border border-emerald-100/50 dark:border-emerald-500/10 shadow-sm transition-transform duration-300 group-hover:scale-110">
        <TrendingUp className="w-6 h-6" />
      </div>
    </div>
  );
}
