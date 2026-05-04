"use client";

import { CheckCircle2, MousePointer2 } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Showcase() {
  return (
    <section id="showcase" className="py-32 bg-[#0A0A0A] border-y border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          {/* Left: Text */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="order-2 lg:order-1 space-y-8"
          >
            <div className="space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                Dashboard Interaktif <br /> Tanpa Kompromi
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Antarmuka yang dirancang khusus untuk kecepatan dan kejelasan. Pantau seluruh ekosistem finansial Anda dalam satu tampilan dashboard yang elegan.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { title: "User Friendly", desc: "Tampilan yang intuitif dan mudah digunakan, bahkan bagi pemula." },
                { title: "Analisis Mendalam", desc: "Dapatkan wawasan tentang kebiasaan belanja Anda." },
                { title: "Responsive UI", desc: "Tampilan yang mulus di desktop, tablet, dan smartphone." }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex gap-4 group"
                >
                  <div className="mt-1 w-6 h-6 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-500 transition-colors group-hover:bg-blue-500 group-hover:text-white">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <p className="text-slate-500 text-sm">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Right: Detailed Mockup */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="order-1 lg:order-2 relative"
          >
            <div className="bg-gradient-to-tr from-blue-600/20 to-transparent absolute inset-0 blur-[100px] -z-10" />
            <div className="bg-[#111111] border border-white/10 rounded-3xl p-8 shadow-2xl relative">
              {/* Fake Sidebar */}
              <div className="flex gap-8">  
                {/* Main Content Mock */}
                <Image src="/mockup/desktop-card-mockup.png" width={800} height={800} alt="Dashboard Mockup" />
              </div>

              {/* Annotation Tooltip */}
              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-2xl"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
                  <p className="text-xs font-bold text-slate-900">Live Expenses Tracker</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ x: [0, 10, 0], y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 -right-6 transform -translate-y-1/2"
              >
                <div className="bg-blue-600 p-3 rounded-full shadow-lg">
                  <MousePointer2 className="w-5 h-5 text-white" />
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
