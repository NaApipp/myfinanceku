"use client";

import { useEffect, useState } from "react";
import {
  Target,
  Trash,
  CheckCircle2,
  Notebook,
} from "lucide-react";

interface TargetData {
  idTarget: string;
  nama_target: string;
  tanggal_target: string;
  jumlah_target: number;
  target_now: number;
  idAccount: string;
  prioritas: string;
  type_target: string;
  description?: string;
}

export default function DataTarget() {
  const [data, setData] = useState<TargetData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [targetToDelete, setTargetToDelete] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  useEffect(() => {
    fetchTargets();
  }, []);

  const fetchTargets = async () => {
    try {
      const response = await fetch("/api/target");
      const result = await response.json();
      if (result.success) {
        setData(result.targets || []);
      }
    } catch (error) {
      console.error("Error fetching targets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!targetToDelete) return;

    setIsActionLoading(true);
    try {
      const response = await fetch(`/api/target/${targetToDelete}`, {
        method: "DELETE",
      });
      const result = await response.json();
      if (result.success) {
        setData((prev) => prev.filter((item) => item.idTarget !== targetToDelete));
        setIsDeleteConfirmOpen(false);
        // Refresh to sync if needed, though state update is enough for UI
      }
    } catch (error) {
      console.error("Error deleting target:", error);
    } finally {
      setIsActionLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateProgress = (now: number, goal: number) => {
    const percentage = (now / goal) * 100;
    return Math.min(Math.max(percentage, 0), 100).toFixed(1);
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-64 bg-gray-50 animate-pulse rounded-[32px] border border-gray-100"
          />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 mt-8 bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
        <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
          <Target className="w-10 h-10 text-gray-300" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">Belum ada target</h3>
        <p className="text-gray-500 text-sm mt-1">Mulai rencanakan impian finansial Anda sekarang.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 mt-8 pb-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.map((item) => {
          const progress = calculateProgress(item.target_now, item.jumlah_target);
          const isCompleted = Number(progress) >= 100;

          return (
            <div
              key={item.idTarget}
              className="group relative bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-1 overflow-hidden"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-6">
                <div className={`p-4 rounded-2xl ${isCompleted ? 'bg-green-50' : 'bg-blue-50'}`}>
                  <Target className={`w-6 h-6 ${isCompleted ? 'text-green-600' : 'text-blue-600'}`} />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                        setTargetToDelete(item.idTarget);
                        setIsDeleteConfirmOpen(true);
                    }}
                    className="p-3 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2 mb-8">
                <h3 className="text-xl font-black text-black leading-tight tracking-tight">
                  {item.nama_target}
                </h3>
                <div className="flex items-center gap-2 text-gray-400">
                  <Notebook className="w-3.5 h-3.5" />
                  <span className="text-xs font-bold">{item.description}</span>
                </div>
              </div>

              {/* Progress Section */}
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">Terkumpul</p>
                        <p className="text-lg font-black text-black tracking-tight">{formatCurrency(item.target_now)}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">Target</p>
                        <p className="text-sm font-bold text-gray-500">{formatCurrency(item.jumlah_target)}</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative h-4 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                  <div
                    className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${
                      isCompleted ? "bg-green-500" : "bg-blue-600"
                    }`}
                    style={{ width: `${progress}%` }}
                  >
                    <div className="absolute top-0 right-0 h-full w-8 bg-white/20 skew-x-[-20deg] animate-pulse" />
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                    <span className={`text-xs font-black tracking-widest uppercase ${isCompleted ? 'text-green-600' : 'text-blue-600'}`}>
                        {progress}% Tercapai
                    </span>
                    {isCompleted && (
                        <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-xs font-black tracking-widest uppercase">Goal Hit!</span>
                        </div>
                    )}
                </div>
              </div>
                    <div className="flex items-center justify-center m-7">
                      <div className="w-full rounded border border-gray-500"></div>
                    </div>
              {item.prioritas &&  (
                <div className="flex justify-between mt-3">
                  <div className="flex flex-col gap-2 items-center">
                  <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">Priority</p>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${
                    item.prioritas === 'penting' ? 'bg-orange-100 text-orange-600' : 
                    item.prioritas === 'sedang' ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {item.prioritas?.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex gap-2 flex-col items-center">
                  <p className="text-[10px] font-black text-gray-400 tracking-widest uppercase mb-1">Tanggal Target</p>
                  <span className="text-xs font-bold text-gray-500">{item.tanggal_target}</span>
                </div>
                </div>
              )}
              
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
            onClick={() => setIsDeleteConfirmOpen(false)}
          />
          <div className="relative bg-white w-full max-w-sm rounded-[40px] shadow-2xl p-10 animate-in zoom-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mb-6 rotate-12 group-hover:rotate-0 transition-transform">
                <Trash className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-black text-black mb-2 tracking-tight">Hapus Target?</h3>
              <p className="text-gray-500 text-sm mb-8 px-4 font-medium leading-relaxed">
                Tindakan ini tidak dapat dibatalkan dan saldo akun Anda mungkin terpengaruh.
              </p>
              <div className="flex flex-col gap-3 w-full">
                <button
                  onClick={handleDelete}
                  disabled={isActionLoading}
                  className="w-full py-5 bg-red-600 text-white font-black rounded-3xl hover:bg-red-700 active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-red-500/20"
                >
                  {isActionLoading ? "Menghapus..." : "Ya, Hapus"}
                </button>
                <button
                  onClick={() => setIsDeleteConfirmOpen(false)}
                  disabled={isActionLoading}
                  className="w-full py-5 bg-gray-50 text-gray-400 font-black rounded-3xl hover:bg-gray-100 transition-all active:scale-[0.98]"
                >
                  Batal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
