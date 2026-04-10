"use client";

import { useEffect, useState } from "react";
import { Wallet, CreditCard, Landmark } from "lucide-react";
import Link from "next/link";

interface AccountData {
  idAccount: string;
  type_asset: string;
  nama_asset: string;
  saldo_awal: string;
  nama_akun: string
}

export default function AccountsOverview() {
  const [loading, setLoading] = useState(true);
  const [accounts, setAccounts] = useState<AccountData[]>([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch("/api/account-card");
        const result = await response.json();
        if (result.success) {
          setAccounts(result.data || []);
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

  const getIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'bank': return <Landmark className="w-5 h-5" />;
      case 'ewallet': return <Wallet className="w-5 h-5" />;
      case 'credit card': return <CreditCard className="w-5 h-5" />;
      default: return <Wallet className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-neutral-900 rounded-[32px] p-6 border border-gray-100 dark:border-white/5 animate-pulse h-64">
        <div className="h-6 w-32 bg-gray-100 dark:bg-white/5 rounded mb-6"></div>
        <div className="grid grid-cols-1 gap-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-gray-50 dark:bg-white/5 rounded-2xl"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-neutral-900 rounded-[32px] border border-gray-100 dark:border-white/5 shadow-sm p-6 flex flex-col h-full transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Akun & Kartu</h3>
        <Link href="/akun-kartu" className="text-sm font-bold text-blue-600 hover:text-blue-700">Manajemen</Link>
      </div>

      <div className="space-y-3 flex-1">
        {accounts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Belum ada akun terdaftar</p>
          </div>
        ) : (
          accounts.slice(0, 4).map((acc) => (
            <div key={acc.idAccount} className="flex items-center justify-between p-4 bg-gray-50/50 dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 rounded-2xl transition-colors border border-transparent hover:border-gray-100 dark:hover:border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-100 dark:border-white/5 flex items-center justify-center text-gray-400 dark:text-gray-500">
                  {getIcon(acc.type_asset)}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{acc.nama_akun}</span>
                  <span className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{acc.type_asset} - {acc.nama_asset}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-black text-gray-900 dark:text-white">{formatCurrency(acc.saldo_awal)}</span>
              </div>
            </div>
          ))
        )}
        {accounts.length > 4 && (
          <p className="text-center text-xs text-gray-400 dark:text-gray-500 font-medium pt-2">+{accounts.length - 4} akun lainnya</p>
        )}
      </div>
    </div>
  );
}
