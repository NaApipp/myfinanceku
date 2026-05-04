"use client";

import { CheckCircle2, ShieldCheck, Zap } from "lucide-react";
import { motion } from "framer-motion";

export default function Benefits() {
  return (
    <section id="benefit" className="py-32 bg-[#0A0A0A]">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="w-full h-[500px] bg-gradient-to-br from-blue-600/20 to-indigo-600/20 rounded-[40px] border border-white/5 relative overflow-hidden">
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                       <ShieldCheck className="w-32 h-32 text-blue-500 opacity-20" />
                    </div>
                  </div>
               </div>
               
               {/* Floating Stats */}
               <motion.div 
                 animate={{ y: [0, -10, 0] }}
                 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                 className="absolute top-12 left-12 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl"
               >
                  <p className="text-[10px] text-blue-400 font-bold uppercase tracking-[0.2em] mb-1">Security</p>
                  <p className="text-white font-bold">Military Grade</p>
               </motion.div>

               <motion.div 
                 animate={{ y: [0, 10, 0] }}
                 transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                 className="absolute bottom-12 right-12 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl"
               >
                  <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-[0.2em] mb-1">Speed</p>
                  <p className="text-white font-bold">0.02s Sync</p>
               </motion.div>
            </div>
          </motion.div>

          <div className="space-y-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-4"
            >
              <h2 className="text-xs font-bold text-blue-500 uppercase tracking-[0.2em]">Mengapa MyFinanceKu?</h2>
              <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                Kebebasan Finansial <br /> dalam Genggaman Anda.
              </h3>
              <p className="text-slate-400 text-lg">
                Kami membangun platform ini dengan satu tujuan: membantu Anda membuat keputusan finansial yang lebih baik setiap harinya.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 gap-6">
              {[
                { title: "Kendali Penuh", icon: <CheckCircle2 className="w-5 h-5 text-blue-500" />, desc: "Pantau setiap rupiah yang keluar dan masuk secara otomatis." },
                { title: "Keamanan Utama", icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />, desc: "Enkripsi end-to-end untuk melindungi data finansial sensitif Anda." },
                { title: "Akses Instan", icon: <Zap className="w-5 h-5 text-amber-500" />, desc: "Buka dari mana saja, kapan saja dengan database yang real-time." }
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-4 p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/20 transition-all group"
                >
                  <div className="mt-1">{item.icon}</div>
                  <div>
                    <h4 className="font-bold text-white group-hover:text-blue-400 transition-colors">{item.title}</h4>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
