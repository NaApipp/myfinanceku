"use client";

import { useEffect, useState } from "react";

import { User } from "lucide-react";

export default function ProfilPengguna() {
    const [user, setUser] = useState<{
    full_name: string;
    email: string;
    username: string;
    no_hp: string;
    level: string;
  } | null>(null);


     useEffect(() => {
    const userData = sessionStorage.getItem("user");
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (error) {
        console.error("Failed to parse user data", error);
      }
    }
  }, []);
  
  const getLevelStyle = (level: string) => {
    switch (level?.toLowerCase()) {
      case "basic":
        return "bg-green-100 text-green-600 border-green-200";
      case "pro":
        return "bg-blue-100 text-blue-600 border-blue-200";
      case "premium":
        return "bg-amber-100 text-amber-600 border-amber-200";
      default:
        return "bg-gray-100 text-gray-600 border-gray-200";
    }
  }
  return (
    <div className=" p-4 rounded-lg">
        <h1 className="text-black font-bold text-[20px] mb-4">Profil Pengguna</h1>

        <div className="text-black flex flex-col bg-white rounded-3xl shadow-md p-7">
            {/* fullname, email, level */}
            <div className="flex items-center gap-5">
                <User className="bg-slate-200 p-2 rounded-full text-white" width={100} height={100}/>
                <div className="text-black flex flex-col gap-2">
                    <p className="text-[20px] font-extrabold">{user?.full_name}</p>
                    <p className="text-[14px] ">{user?.no_hp}</p>
                    <div className={`mt-1 w-min inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${getLevelStyle(user?.level || "")}`}>
                        {user?.level || "basic"}
                    </div>
                </div>
            </div>

            {/* Container fullname and email */}
            <div className="grid grid-cols-2 mt-4 gap-3">
                <div className="flex flex-col gap-2.5">
                    <label htmlFor="full_name" className="text-[14px] uppercase font-bold text-gray-500">Nama Lengkap</label>
                    <input type="text" name="full_name" id="full_name" value={user?.full_name} readOnly className="border border-gray-200 rounded-lg px-2 py-3 bg-[#F3F3F3] font-reguler" disabled />
                </div>
                <div className="flex flex-col gap-2.5">
                    <label htmlFor="email" className="text-[14px] uppercase font-bold text-gray-500">Alamat Email</label>
                    <input type="text" name="email" id="email" value={user?.email} readOnly className="border border-gray-200 rounded-lg px-2 py-3 bg-[#F3F3F3] font-reguler" disabled />
                </div>
            </div>
            
        </div>
    </div>
  )
}