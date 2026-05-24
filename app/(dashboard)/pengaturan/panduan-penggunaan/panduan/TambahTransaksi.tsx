"use client";

import { CheckCircle2, Info, Pencil, X } from "lucide-react";
import { useState } from "react";

export default function TambahTransaksi() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        type="button"
        title="Panduan Tambah Transaksi"
        className="text-left"
      >
        <div
          className={`p-6 rounded-2xl bg-white dark:bg-[#1c1c1e] border border-gray-200 hover:border-gray-300 dark:border-zinc-800 dark:hover:border-zinc-700 cursor-pointer transition-colors`}
        >
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 bg-indigo-400/10`}
          >
            <Pencil className="w-5 h-5 text-indigo-400" />
          </div>
          <h3 className="text-gray-900 dark:text-white font-bold text-base mb-1">
            Tambah Transaksi
          </h3>
          <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            Cara menambahkan pemasukan dan pengeluaran harian
          </p>
        </div>
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 lg:p-8">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-300"
            onClick={() => setOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative bg-white w-full max-w-2xl max-h-[90vh] rounded-[24px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-300">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <Pencil className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 leading-none">
                    Panduan Tambah Transaksi
                  </h2>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="cursor-pointer p-2 hover:bg-slate-100 rounded-full transition-all active:scale-90"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            {/* Body - Scrollable Area */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 scroll-smooth custom-scrollbar">
              <section>
                <p className="text-slate-600 leading-relaxed text-sm">
                  Fitur{" "}
                  <span className="font-bold text-slate-900">
                    Tambah Transaksi
                  </span>{" "}
                  memungkinkan Anda untuk mencatat setiap pemasukan dan
                  pengeluaran harian dengan mudah. Ikuti langkah-langkah di
                  bawah ini untuk mulai mencatat keuangan Anda.
                </p>
              </section>

              <div className="space-y-8">
                {/* 1. Akses Tombol Tambah */}
                <section className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[10px]">
                      01
                    </span>
                    Akses Tombol Tambah
                  </h3>
                  <div className="pl-8 text-sm text-slate-600 space-y-2">
                    <p>
                      Cari dan klik tombol <strong>Tambah Transaksi</strong> di
                      halaman utama (Dashboard) atau halaman Transaksi.
                    </p>
                  </div>
                </section>

                {/* 2. Pilih Jenis Transaksi */}
                <section className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[10px]">
                      02
                    </span>
                    Pilih Jenis Transaksi
                  </h3>
                  <div className="pl-8 text-sm text-slate-600 space-y-3">
                    <p>
                      Tentukan apakah transaksi yang akan dicatat adalah
                      Pemasukan atau Pengeluaran:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div>
                          <p className="font-bold text-emerald-900 text-xs mb-0.5">
                            Pemasukan
                          </p>
                          <p className="text-emerald-700 text-[11px] leading-tight">
                            Seperti gaji, bonus, hasil investasi, dll.
                          </p>
                        </div>
                      </div>
                      <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center shrink-0">
                          <CheckCircle2 className="w-4 h-4 text-rose-600" />
                        </div>
                        <div>
                          <p className="font-bold text-rose-900 text-xs mb-0.5">
                            Pengeluaran
                          </p>
                          <p className="text-rose-700 text-[11px] leading-tight">
                            Seperti makan, transportasi, tagihan, dll.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* 3. Lengkapi Detail Transaksi */}
                <section className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[10px]">
                      03
                    </span>
                    Lengkapi Detail Transaksi
                  </h3>
                  <div className="pl-8 space-y-4">
                    <ul className="space-y-3">
                      {[
                        {
                          title: "Nominal",
                          desc: "Masukkan nomninal dana yang akan masuk atau keluar.",
                          icon: <Info className="w-4 h-4 text-blue-500" />,
                        },
                        {
                          title: "Tipe Transaksi ",
                          desc: "Pilih tipe transaksi (Pemasukan atau Pengeluaran).",
                          icon: (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ),
                        },
                        {
                          title: "Tanggal Transaksi",
                          desc: "Tentukan tanggal terjadinya transaksi.",
                          icon: (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ),
                        },
                        {
                          title: "Kategori Transaksi",
                          desc: "Pilih kategori yang sesuai agar data pemasukan dan pengeluaran dapat dianalisis dengan baik.",
                          icon: (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ),
                        },
                        {
                          title: "Sumber Dana",
                          desc: "Pilih sumber dana transaksi yang telah di buat sebelumnya.",
                          icon: (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                          ),
                        },
                        {
                          title: "Catatan (Opsional)",
                          desc: "Tambahkan keterangan spesifik bila diperlukan agar mudah diingat.",
                          icon: <Pencil className="w-4 h-4 text-indigo-500" />,
                        },
                      ].map((item, i) => (
                        <li
                          key={i}
                          className="flex gap-3 text-sm text-slate-600"
                        >
                          <div className="mt-0.5 shrink-0">{item.icon}</div>
                          <div>
                            <span className="font-bold text-slate-900">
                              {item.title}
                            </span>{" "}
                            — {item.desc}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </section>

                {/* 4. Simpan Transaksi */}
                <section className="space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 text-white text-[10px]">
                      04
                    </span>
                    Simpan & Cek Laporan
                  </h3>
                  <div className="pl-8 space-y-3 text-sm text-slate-600">
                    <p>
                      Setelah semua data terisi, klik tombol{" "}
                      <strong>Simpan Transaksi</strong>. Data akan langsung ke{" "}
                      <strong>Menu Transaksi</strong>.
                    </p>
                    <div className="p-4 bg-indigo-50 rounded-xl border border-indigo-100 flex gap-3">
                      <Info className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-indigo-900 text-sm mb-1">
                          Tips Mengelola Keuangan:
                        </p>
                        <p className="text-indigo-800 text-xs leading-relaxed">
                          Biasakan mencatat transaksi segera setelah terjadi
                          agar Anda tidak lupa dan laporan keuangan selalu
                          akurat.
                        </p>
                      </div>
                    </div>
                  </div>
                </section>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end">
              <button
                onClick={() => setOpen(false)}
                className="cursor-pointer px-6 py-2.5 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all active:scale-95 shadow-lg shadow-slate-900/10"
              >
                Saya Paham
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
