"use client";

import React, { useEffect, useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  Shield, 
  Search, 
  Users, 
  MoreVertical,
  Fingerprint,
  AtSign,
  Loader2,
  Edit
} from "lucide-react";
import { useRouter } from "next/navigation";

interface user {
  idUser: string;
  full_name: string;
  email: string;
  username: string;
  no_hp: string;
  level: string;
}

export default function UserPage() {
  const [users, setUsers] = useState<user[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter()


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/admin/user_cust");
        const result = await response.json();
        if (result.success) {
          setUsers(result.data);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Gagal memuat data pengguna.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);
  
  const handleViewDetail = (idUser: string) => {
    router.push(`/user/${idUser}`);
  };

  const getLevelStyle = (level: string) => {
    switch (level?.toLowerCase()) {
      case "basic":
        return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20";
      case "medium":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20";
      case "advanced":
        return "bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-400 dark:border-red-500/20";
      case "super admin":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-500/10 dark:text-green-400 dark:border-green-500/20";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-500/10 dark:text-gray-400 dark:border-gray-500/20";
    }
  };

  const filteredUsers = users.filter(user => 
    user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Manajemen Pengguna
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Kelola dan pantau semua pengguna yang terdaftar di sistem.
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Cari pengguna..."
              className="pl-10 pr-4 py-2 text-sm bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all w-full md:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-3 py-2 rounded-xl text-sm font-semibold border border-blue-100 dark:border-blue-500/20 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
            {users.length} Total
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-white/10 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-200 dark:border-white/10">
                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-4 h-4 opacity-50" />
                    ID User
                  </div>
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 opacity-50" />
                    Full Name
                  </div>
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 opacity-50" />
                    Email
                  </div>
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <AtSign className="w-4 h-4 opacity-50" />
                    Username
                  </div>
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 opacity-50" />
                    No HP
                  </div>
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 opacity-50" />
                    Level
                  </div>
                </th>
                <th className="px-6 py-4 font-semibold text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <Edit className="w-4 h-4 opacity-50" />
                    Action
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                      <p className="text-gray-500 dark:text-gray-400 font-medium">Memuat data pengguna...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr
                    key={user.idUser}
                    className="hover:bg-gray-50/50 dark:hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                      <span className="bg-gray-100 dark:bg-white/10 px-2 py-1 rounded text-xs">
                        #{user.idUser}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold uppercase shadow-sm group-hover:scale-110 transition-transform">
                          {user.full_name.charAt(0)}
                        </div>
                        <span className="text-gray-700 dark:text-gray-300 font-medium">{user.full_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400 font-mono text-xs">@{user.username}</td>
                    <td className="px-6 py-4 text-gray-600 dark:text-gray-400">{user.no_hp}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`${getLevelStyle(user.level)} px-3 py-1 rounded-full text-[11px] font-bold border uppercase tracking-wider`}
                      >
                        {user.level}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewDetail(user.idUser)}
                        className="text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit user"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-white/5 flex items-center justify-center mb-2">
                        <Users className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-900 dark:text-white font-semibold">Tidak ada pengguna ditemukan</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Coba kata kunci pencarian lain.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

