"use client";

import React, { useEffect, useState, use } from "react";
import { 
  Users, 
  ArrowLeft, 
  Shield, 
  Mail, 
  Phone, 
  User, 
  Calendar,
  Save,
  Loader2,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import ButtonCopy from "@/app/components/ButtonCopy";

interface DetailUser {
  idUser: string;
  full_name: string;
  email: string;
  username: string;
  no_hp: string;
  level: string;
  createdAt: string;
}

export default function UserDetailPage({ idUser }: { idUser: string }) {
  const router = useRouter();
  const params = useParams();

  const [data, setData] = useState<DetailUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [newLevel, setNewLevel] = useState("");
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/user_cust`);
      const result = await response.json();
      
      if (result.success) {
        const user = result.data.find((u: DetailUser) => u.idUser === idUser);
        if (user) {
          setData(user);
          setNewLevel(user.level);
        } else {
          setError("Pengguna tidak ditemukan.");
        }
      } else {
        setError(result.message || "Gagal mengambil data.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Gagal memuat data pengguna.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idUser) fetchUser();
  }, [idUser]);

  const handleChangeLevel = async () => {
    if (!data || isUpdating || !newLevel) return;

    try {
      setIsUpdating(true);
      setUpdateSuccess(false);
      
      const response = await fetch(`/api/admin/user_cust/${idUser}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          level: newLevel,
        }),
      });

      if (response.ok) {
        setUpdateSuccess(true);
        // Update local state
        setData(prev => prev ? { ...prev, level: newLevel } : null);
        setTimeout(() => setUpdateSuccess(false), 3000);
      } else {
        const json = await response.json();
        alert(json.message || "Gagal memperbarui level");
      }
    } catch (err) {
      console.error("Error updating level:", err);
      alert("Terjadi kesalahan koneksi saat memperbarui level");
    } finally {
      setIsUpdating(false);
    }
  };

  const levels = ["Basic", "Medium", "Advanced", "Super Admin"];

  const getLevelStyle = (level: string) => {
    switch (level?.toLowerCase()) {
      case "basic":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
      case "medium":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
      case "advanced":
        return "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-500/10 dark:text-purple-400 dark:border-purple-500/20";
      case "super admin":
        return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20";
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium animate-pulse">Memuat data pengguna...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen p-6 flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="w-16 h-16 bg-red-50 dark:bg-red-500/10 rounded-full flex items-center justify-center">
          <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
        </div>
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Terjadi Kesalahan</h2>
          <p className="text-gray-500 dark:text-gray-400 mt-1">{error || "Data tidak ditemukan."}</p>
        </div>
        <Link 
          href="/user"
          className="px-4 py-2 bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-white/20 transition-colors flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Link>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <Link 
          href="/user" 
          className="group flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors"
        >
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-white/5 group-hover:bg-blue-50 dark:group-hover:bg-blue-500/10 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </div>
          <span className="font-medium">Kembali ke Daftar</span>
        </Link>
        
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full border text-[11px] font-bold uppercase tracking-wider ${getLevelStyle(data.level)}`}>
          <Shield className="w-3 h-3" />
          {data.level}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full -mr-16 -mt-16 blur-3xl" />
            
            <div className="flex items-start gap-6 relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white text-3xl font-bold shadow-xl shadow-blue-500/20">
                {data.full_name.charAt(0)}
              </div>
              <div className="space-y-1 pt-2">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {data.full_name}
                </h1>
                <p className="text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <span className="font-mono bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded text-sm text-blue-600">@{data.username}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
                  <span className="text-sm">ID: #{data.idUser}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10 pt-10 border-t border-gray-100 dark:border-white/5">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Mail className="w-3 h-3" /> Email Address
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">{data.email}</p>
                  <ButtonCopy text={data.email} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Phone className="w-3 h-3" /> Phone Number
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-gray-700 dark:text-gray-300 font-medium">{data.no_hp || "-"}</p>
                  <ButtonCopy text={data.no_hp || ""} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Calendar className="w-3 h-3" /> Member Since
                </p>
                <p className="text-gray-700 dark:text-gray-300 font-medium">
                  {/* {data.createdAt ? new Date(data.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : "-"} */}
                  {data.createdAt}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Card */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-3xl p-6 shadow-sm">
            <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-blue-600" />
              Update User Level
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select Level</label>
                <div className="relative group">
                  <select 
                    value={newLevel}
                    onChange={(e) => setNewLevel(e.target.value)}
                    className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 dark:text-white appearance-none cursor-pointer hover:bg-gray-100 dark:hover:bg-white/10"
                  >
                    {levels.map(level => (
                      <option key={level} value={level} className="bg-white dark:bg-neutral-900 text-gray-900 dark:text-white font-medium py-2">
                        {level}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 group-hover:text-blue-500 transition-colors">
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </div>
              </div>

              <button
                onClick={handleChangeLevel}
                disabled={isUpdating || newLevel === data.level}
                className={`w-full py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 ${
                  newLevel === data.level 
                  ? 'bg-gray-100 dark:bg-white/5 text-gray-400 cursor-not-allowed shadow-none' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98]'
                }`}
              >
                {isUpdating ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : updateSuccess ? (
                  <CheckCircle2 className="w-4 h-4" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                {isUpdating ? 'Updating...' : updateSuccess ? 'Saved!' : 'Simpan Perubahan'}
              </button>
              
              {updateSuccess && (
                <p className="text-center text-xs text-green-600 dark:text-green-400 font-medium animate-in fade-in slide-in-from-top-1 duration-300">
                  Level pengguna berhasil diperbarui!
                </p>
              )}
            </div>
          </div>

          <div className="bg-blue-600/5 border border-blue-600/10 rounded-2xl p-4">
            <p className="text-xs text-blue-700 dark:text-blue-300 leading-relaxed">
              <span className="font-bold block mb-1">Informasi:</span>
              Perubahan level pengguna akan langsung berdampak pada hak akses dan fitur yang tersedia bagi pengguna tersebut di aplikasi.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

