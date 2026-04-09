"use client";

import SummaryCard from "../akun-kartu/components/SummaryCard";
import RecentTransactions from "./components/RecentTransactions";
import AccountsOverview from "./components/AccountsOverview";
import BudgetsOverview from "./components/BudgetsOverview";
import TargetProgress from "./components/TargetProgress";
import { Plus, LayoutDashboard, Calendar, Search } from "lucide-react";
import { useState, useEffect } from "react";
import TambahTransaksi from "@/app/components/TambahTransaksi";

export default function GeneralPage() {
  const [greeting, setGreeting] = useState("");
  const [fullName, setFullName] = useState("User");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Selamat Pagi");
    else if (hours < 15) setGreeting("Selamat Siang");
    else if (hours < 18) setGreeting("Selamat Sore");
    else setGreeting("Selamat Malam");

    // Menampilkan data dari sessionStorage dulu (cepat)
    const sessionUser = sessionStorage.getItem("user");
    if (sessionUser) {
      try {
        const parsed = JSON.parse(sessionUser);
        if (parsed.full_name) setFullName(parsed.full_name);
      } catch (e) {
        console.error("Error parsing session user", e);
      }
    }

    // Ambil data terbaru dari API untuk sinkronisasi
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/update-user");
        const data = await response.json();
        if (data.success && data.user) {
          setFullName(data.user.full_name || "User");
          sessionStorage.setItem("user", JSON.stringify(data.user));
        }
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-gray-950 p-6 lg:p-10 space-y-10">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest mb-2">
            <span>Selamat Datang</span>
          </div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            {greeting}, <span className="text-blue-600">{fullName}</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Berikut adalah ringkasan keuangan pribadimu hari ini.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative group hidden">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Cari transaksi..." 
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl py-3 pl-11 pr-6 text-sm outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 transition-all w-full md:w-64"
            />
          </div>
          <TambahTransaksi />
        </div>
      </header>

      {/* Hero Section - Finances Summary */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SummaryCard />
        </div>
        <div className="lg:col-span-1">
          <TargetProgress />
        </div>
      </section>

      {/* Middle Section - Accounts and Budgets */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AccountsOverview />
        <BudgetsOverview />
      </section>

      {/* Bottom Section - Transactions */}
      <section>
        <RecentTransactions />
      </section>

      {/* Quick Stats Banner */}
      <div className="hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-[32px] p-8 text-white relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
              <Calendar className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-xl font-bold">Laporan Keuangan Bulanan</h4>
              <p className="text-white/70 text-sm">Update keuangan Anda untuk bulan April sudah siap.</p>
            </div>
          </div>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-2xl font-bold hover:bg-blue-50 transition-colors whitespace-nowrap">
            Download Report
          </button>
        </div>
        
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      </div>
    </div>
  );
}