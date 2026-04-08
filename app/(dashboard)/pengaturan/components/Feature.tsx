"use client";

import { List, ChevronRight, X, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function Feature() {
  const [isOpen, setIsOpen] = useState(false);

  const [message, setMessage] = useState({
    text: "",
    type: "",
  });

  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    nama_kategori: "",
  });

// Hndler Change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/kategori", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (data.success) {
        setIsOpen(false);
        setFormData({
          nama_kategori: "",
        });
        setMessage({
          text: data.message,
          type: "success",
        });
        setTimeout(() => {
          setIsOpen(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error processing category:", error);
    }
  };

  return (
    <div className=" p-4 rounded-lg px-0">
      <h1 className="text-black dark:text-white font-bold text-2xl mb-6">Feature</h1>

      <div className="text-black dark:text-white flex flex-row justify-between items-center bg-white dark:bg-neutral-900 rounded-[32px] shadow-md p-8 border border-gray-100 dark:border-white/5 transition-colors duration-300">
        {/* icon & text */}
        <div className="flex flex-row items-center gap-4">
          <div className="p-3 bg-gray-50 dark:bg-white/5 rounded-2xl">
            <List className="text-black dark:text-white" width={24} height={24} />
          </div>
          <div className="">
            <h2 className="text-lg font-semibold">Tambah Kategori</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tambah kategori untuk mempermudah pencatatan pengeluaran atau pemasukan.
            </p>
          </div>
        </div>
        <button
        onClick={() => setIsOpen(true)} 
          className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
        >
          <ChevronRight className="text-black dark:text-white" width={24} height={24} />
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <List className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-black">Tambah Kategori</h2>
                  <p className="text-xs text-gray-500 font-medium">Tentukan impian finansial Anda</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            {/* Scrollable Form Area */}
            <div className="overflow-y-auto p-6 custom-scrollbar">
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-6"
              >
                {/* Nama Target */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="nama_target" className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                      Nama Kategori
                  </label>
                  <input
                    required
                    type="text"
                    name="nama_kategori"
                    id="nama_kategori"
                    placeholder="Contoh: Tabungan Mobil"
                    className="w-full p-4 rounded-2xl border border-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 text-black font-semibold placeholder:text-gray-300"
                    value={formData.nama_kategori}
                    onChange={handleChange}
                  />
                </div>

                

                {message.text && (
                  <div
                    className={`p-4 rounded-2xl flex items-center gap-3 text-sm font-bold animate-in slide-in-from-top-2 duration-300 ${
                      message.type === "error"
                        ? "bg-red-50 text-red-600 border border-red-100"
                        : "bg-green-50 text-green-600 border border-green-100"
                    }`}
                  >
                    {message.type === "error" ? (
                      <AlertCircle className="w-5 h-5 shrink-0" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 shrink-0" />
                    )}
                    {message.text}
                  </div>
                )}

                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-black hover:bg-neutral-800 disabled:bg-gray-400 text-white font-bold py-5 px-4 rounded-[24px] shadow-xl transition-all transform active:scale-[0.98] mt-2 flex items-center justify-center gap-3"
                >
                  {loading ? "Menyimpan..." : "Simpan Target"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
