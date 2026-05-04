"use client";

import { Zap, ShieldCheck, BarChart3, Target } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Instant Logging",
    description: "Catat setiap transaksi dalam hitungan detik. Cepat, mudah, dan akurat untuk memantau pengeluaran harian Anda.",
    color: "blue"
  },
  {
    icon: <ShieldCheck className="w-6 h-6" />,
    title: "Smart Budgeting",
    description: "Atur batas pengeluaran bulanan dengan cerdas. Sistem kami akan memberi peringatan sebelum Anda melampaui budget.",
    color: "emerald"
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Real-time Reports",
    description: "Visualisasi data keuangan yang mendalam. Lihat tren pengeluaran dan pemasukan Anda melalui grafik interaktif.",
    color: "purple"
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Financial Goals",
    description: "Rencanakan masa depan Anda. Tetapkan target tabungan untuk rumah, kendaraan, atau liburan impian Anda.",
    color: "rose"
  }
];

export default function Features() {
  return (
    <section id="feature" className="py-32 bg-[#0A0A0A] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-20 space-y-4"
        >
          <h2 className="text-xs font-bold text-blue-500 uppercase tracking-[0.2em]">Pilar Utama</h2>
          <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
            Fitur Canggih untuk <br /> Kendali Finansial Mutlak
          </h3>
          <p className="text-slate-500 text-lg">
            MyFinanceKu memberikan alat yang Anda butuhkan untuk mengelola uang dengan lebih cerdas, bukan lebih keras.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group p-8 rounded-[24px] bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all duration-500 hover:-translate-y-2"
            >
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-lg ${
                feature.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                feature.color === 'emerald' ? 'bg-emerald-500/20 text-emerald-400' :
                feature.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                'bg-rose-500/20 text-rose-400'
              }`}>
                {feature.icon}
              </div>
              <h4 className="text-xl font-bold text-white mb-3 tracking-tight">
                {feature.title}
              </h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
