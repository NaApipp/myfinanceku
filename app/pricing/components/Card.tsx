import { Check, X } from "lucide-react";
import Link from "next/link";

export default function Card() {
  return (
    <div className="grid md:grid-cols-3 grid-cols-1 gap-6 p-5">
      {/* BASIC Plan */}
      <div className="flex flex-col p-8 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 shadow-sm hover:shadow-md transition-all duration-300 group">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Basic
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Untuk individu yang baru memulai.
          </p>
        </div>
        <div className="mb-8 flex items-baseline">
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
            Gratis
          </span>
        </div>
        <div className="space-y-4 mb-10 grow">
          <div className="flex items-center p-2 -mx-2 rounded-lg transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-900/50">
            <X className="w-5 h-5 text-red-500 mr-3 shrink-0" />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Buat Anggaran
            </span>
          </div>
          <div className="flex items-center p-2 -mx-2 rounded-lg transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-900/50">
            <X className="w-5 h-5 text-red-500 mr-3 shrink-0" />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Buat Target
            </span>
          </div>
          <div className="flex items-center p-2 -mx-2 rounded-lg transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-900/50">
            <X className="w-5 h-5 text-red-500 mr-3 shrink-0" />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Lihat Statistik
            </span>
          </div>
        </div>
        <button className="w-full py-3 border border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 font-semibold text-sm rounded-xl hover:bg-slate-900 dark:hover:bg-slate-100 hover:text-white dark:hover:text-slate-900 transition-all duration-300 cursor-pointer">
          <Link href="/register">Mulai Gratis</Link>
        </button>
      </div>

      {/* MEDIUM Plan */}
      <div className="flex flex-col p-8 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-950 shadow-sm hover:shadow-md transition-all duration-300 group">
        <div className="mb-8">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Medium
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Optimalkan manajemen target harian
          </p>
        </div>
        <div className="mb-8 flex items-baseline">
          <span className="text-xl font-bold text-slate-900 dark:text-white mr-1">
            Rp
          </span>
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
            30.000
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">
            / bulan
          </span>
        </div>
        <div className="space-y-4 mb-10 grow">
          <div className="flex items-center p-2 -mx-2 rounded-lg transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-900/50">
            <X className="w-5 h-5 text-red-500 mr-3 shrink-0" />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Buat Anggaran
            </span>
          </div>
          <div className="flex items-center p-2 -mx-2 rounded-lg transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-900/50">
            <Check className="p-1 bg-green-500 text-white rounded-full w-5 h-5 mr-3 shrink-0" />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Buat Target
            </span>
          </div>
          <div className="flex items-center p-2 -mx-2 rounded-lg transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-900/50">
            <Check className="p-1 bg-green-500 text-white rounded-full w-5 h-5 mr-3 shrink-0" />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Lihat Statistik
            </span>
          </div>
        </div>
        <button className="w-full py-3 border border-slate-900 dark:border-slate-100 text-slate-900 dark:text-slate-100 font-semibold text-sm rounded-xl hover:bg-slate-900 dark:hover:bg-slate-100 hover:text-white dark:hover:text-slate-900 transition-all duration-300 cursor-pointer">
          <Link href="/register">Pilih Level</Link>
        </button>
      </div>

      {/* ADVANCED Plan */}
      <div className="relative flex flex-col p-8 border-2 border-blue-600 dark:border-blue-500 rounded-2xl bg-white dark:bg-slate-950 shadow-md hover:shadow-lg transition-all duration-300 transform md:scale-105 z-10 group">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white font-semibold text-xs px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
          Paling Populer
        </div>
        <div className="mb-8 pt-2">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
            Advanced
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Analisis mendalam untuk pro finansial.
          </p>
        </div>
        <div className="mb-8 flex items-baseline">
          <span className="text-xl font-bold text-slate-900 dark:text-white mr-1">
            Rp
          </span>
          <span className="text-3xl font-extrabold text-slate-900 dark:text-white">
            50.000
          </span>
          <span className="text-sm text-slate-500 dark:text-slate-400 ml-1">
            / Seumur Hidup
          </span>
        </div>
        <div className="space-y-4 mb-10 grow">
          <div className="flex items-center p-2 -mx-2 rounded-lg transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-900/50">
            <Check className="p-1 bg-green-500 text-white rounded-full w-5 h-5 mr-3 shrink-0" />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Buat Anggaran
            </span>
          </div>
          <div className="flex items-center p-2 -mx-2 rounded-lg transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-900/50">
            <Check className="p-1 bg-green-500 text-white rounded-full w-5 h-5 mr-3 shrink-0" />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Buat Target
            </span>
          </div>
          <div className="flex items-center p-2 -mx-2 rounded-lg transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-900/50">
            <Check className="p-1 bg-green-500 text-white rounded-full w-5 h-5 mr-3 shrink-0" />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Lihat Statistik
            </span>
          </div>
          <div className="flex items-center p-2 -mx-2 rounded-lg transition-colors duration-200 hover:bg-slate-50 dark:hover:bg-slate-900/50">
            <Check className="p-1 bg-green-500 text-white rounded-full w-5 h-5 mr-3 shrink-0" />
            <span className="text-sm text-slate-700 dark:text-slate-300">
              Prioritas Dukungan
            </span>
          </div>
        </div>
        <button className="w-full py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold text-sm rounded-xl hover:bg-blue-700 dark:hover:bg-blue-600 transition-all duration-300 cursor-pointer shadow-sm shadow-blue-500/25">
          <Link href="/register">Pilih Level</Link>
        </button>
      </div>
    </div>
  );
}
