"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CTA() {
  return (
    <section className="py-32 bg-[#0A0A0A] relative overflow-hidden">
      {/* Background Decorative Element */}
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.15, 0.1]
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-600/10 rounded-full blur-[160px] -z-10" 
      />

      <div className="max-w-5xl mx-auto px-6 md:px-12 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="p-12 md:p-20 rounded-[48px] bg-gradient-to-b from-blue-600/20 to-transparent border border-blue-500/20 relative overflow-hidden group"
        >
          <div className="relative z-10 space-y-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]"
            >
              Mulai Atur Keuanganmu <br /> <span className="text-blue-500">Sekarang Juga.</span>
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed"
            >
                Setiap langkah besar dimulai dari manajemen keuangan yang disiplin. Wujudkan impian finansial Anda dengan pencatatan yang presisi bersama MyFinanceKu.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <Link href="/registrasi" className="px-10 py-5 bg-white text-black hover:bg-slate-200 rounded-2xl font-black transition-all flex items-center justify-center gap-2 group shadow-2xl shadow-white/5">
                Coba Beta Sekarang
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="https://discord.gg/FUeeHJWU9c" className="px-10 py-5 bg-blue-600/10 hover:bg-blue-600/20 text-white border border-blue-500/20 rounded-2xl font-bold transition-all backdrop-blur-md">
                Hubungi Support Center
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
