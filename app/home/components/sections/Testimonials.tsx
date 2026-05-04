"use client";

import { Quote } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Aditya Pratama",
    role: "Software Engineer",
    text: "MyFinanceKu mengubah cara saya melihat uang. Dashboard-nya sangat intuitif dan membantu saya menabung 30% lebih banyak setiap bulan.",
    avatar: "AP"
  },
  {
    name: "Siska Amelia",
    role: "Freelance Designer",
    text: "Akhirnya ada aplikasi keuangan yang tidak membosankan. Desainnya sangat premium dan fitur budgeting-nya sangat akurat.",
    avatar: "SA"
  },
  {
    name: "Budi Santoso",
    role: "Entrepreneur",
    text: "Sangat membantu untuk memisahkan keuangan pribadi dan bisnis kecil saya. Laporan real-time-nya sangat berharga bagi saya.",
    avatar: "BS"
  }
];

export default function Testimonials() {
  return (
    <section className="py-32 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto mb-20 space-y-4"
        >
          <h2 className="text-xs font-bold text-blue-500 uppercase tracking-[0.2em]">Testimonial</h2>
          <h3 className="text-4xl font-bold text-white tracking-tight">Kisah Sukses Pengguna</h3>
          <p className="text-slate-500">Dengarkan langsung dari mereka yang telah mengubah masa depan finansialnya bersama kami.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="p-8 rounded-[32px] bg-white/5 border border-white/5 hover:bg-white/[0.07] transition-all relative group"
            >
              <Quote className="absolute top-6 right-8 w-10 h-10 text-white/5 group-hover:text-blue-500/10 transition-colors" />
              <div className="space-y-6 relative z-10">
                <p className="text-slate-300 italic leading-relaxed text-lg">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white font-bold shadow-lg">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">{t.name}</h4>
                    <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
