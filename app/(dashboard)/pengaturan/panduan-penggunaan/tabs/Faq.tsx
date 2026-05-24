"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";

const faqs = [
  {
    question: "Apakah saya bisa mengedit atau menghapus transaksi?",
    answer:
      "Untuk mengedit belum bisa, untuk mengatasi hal tersebut bisa dengan cara hapus riwayat transaksi dan tambahkan kembalu Transaksi.",
  },
  {
    question: "Kenapa saldo saya tidak sesuai?",
    answer:
      "Pastikan semua transaksi sudah tercatat dengan benar. Periksa juga apakah ada transaksi yang belum dimasukkan atau salah nominal. Jika masih tetp ada kesalahan, harap hubungi Support Center",
  },
  {
    question: "Bagaimana cara melihat laporan keuangan?",
    answer:
      "Masuk ke menu statistik untuk melihat ringkasan pemasukan, pengeluaran, dan saldo Anda.",
  },
  {
    question: "Apa arti grafik yang ditampilkan?",
    answer:
      "Grafik menunjukkan perbandingan pemasukan dan pengeluaran dalam periode tertentu agar Anda lebih mudah memahami kondisi keuangan, Total kepemilikan dana, pengluaran Per Kategori, kategori paling Boros, dan Transaksi Terboros.",
  },
  {
    question: "Apakah data diperbarui secara otomatis?",
    answer:
      "Ya, setiap transaksi yang Anda tambahkan akan langsung mempengaruhi laporan dan statistik.",
  },
  {
    question: "Kenapa data saya tidak muncul?",
    answer:
      "Coba refresh halaman atau periksa koneksi internet Anda. Pastikan juga Anda menggunakan akun yang benar. Jika masih belum bisa, hubungi Support Center",
  },
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-8">
      <div className="flex items-center gap-3 mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Pertanyaan yang Sering Diajukan
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Temukan jawaban untuk pertanyaan umum seputar penggunaan aplikasi.
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="border border-gray-200 dark:border-gray-800 rounded-2xl overflow-hidden bg-white dark:bg-gray-900 shadow-sm transition-colors"
          >
            <button
              onClick={() => toggleFaq(index)}
              className="w-full flex items-center justify-between p-5 text-left focus:outline-none"
            >
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {faq.question}
              </span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="flex-shrink-0 ml-4"
              >
                <ChevronDown className="w-5 h-5 text-gray-500" />
              </motion.div>
            </button>
            <AnimatePresence initial={false}>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-5 pb-5 text-gray-600 dark:text-gray-400">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
