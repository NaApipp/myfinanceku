"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import TotalExpense from "./components/TotalExpense";
import TotalIncome from "./components/TotalIncome";
import TotalBalance from "./components/totalBalance";
import ExpanseCategory from "./components/ExpanseCategory";
import StatisticWidgets from "./components/StatisticWidgets";
import LockedFeature from "@/app/components/LockedFeature";

export default function Page() {
  const [userLevel, setUserLevel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        if (parsed.level) {
          setUserLevel(parsed.level);
        } else {
          setUserLevel("basic");
        }
      } catch (e) {
        setUserLevel("basic");
      }
    } else {
      setUserLevel("basic");
    }
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50 dark:bg-black">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  // Basic cannot see statistics. Medium and Advanced can.
  if (userLevel?.toLowerCase() === "basic") {
    return (
      <LockedFeature 
        requiredLevel="Medium" 
        featureName="Statistik" 
        description="Analisis mendalam pengeluaran, pendapatan, dan pertumbuhan tabungan bulanan Anda."
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFF] dark:bg-black p-6 lg:p-10 space-y-10 transition-colors duration-300">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Statistik.
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 font-medium">
            Ringkasan Keuangan Bulan Ini.
          </p>
        </div>
      </header> 

      {/* Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <TotalIncome />
        <TotalExpense />
        <TotalBalance />
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ExpanseCategory />
        </div>
        <div className="lg:col-span-1">
          <StatisticWidgets />
        </div>
      </section>
    </div>
  );
}
