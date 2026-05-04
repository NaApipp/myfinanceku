/**
 * Footer.tsx
 * ----------
 * Komponen footer website RPL SMKN 4 Kendal. Berisi informasi kontak singkat,
 * link navigasi cepat, dan tautan sosial media sekolah.
 *
 * Digunakan pada main route seperti /, /tentang, /kurikulum, dan /kontak.
 *
 * Format: React TypeScript
 */

"use client";

import TermOnService from "@/app/components/doc/TermOnService";
import PrivacyPolicy from "@/app/components/doc/PrivacyPolicy";

import Link from "next/link";
import { Globe, MessageSquare, Mail } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A0A0A] w-full py-12 px-6 md:px-12 border-t border-slate-900 text-">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-7xl mx-auto text-xs leading-relaxed">
        <div className="col-span-2 md:col-span-1 space-y-4">
          <div className="text-lg font-black text-slate-100">MyFinanceKu</div>
          <p className="text-slate-500 max-w-xs">
            Aplikasi manajemen keuangan pribadi berperforma tinggi yang
            dirancang untuk membantu Anda melacak, mengelola, dan mengoptimalkan
            finansial secara sistematis.
          </p>
          <div className="flex gap-4">
            <a
              className="text-slate-500 hover:text-slate-200 transition-colors"
              href="/register"
            >
              <Globe />
            </a>
            <a
              className="text-slate-500 hover:text-slate-200 transition-colors"
              href="https://discord.gg/FUeeHJWU9c"
            >
              <MessageSquare />
            </a>
            <a
              className="text-slate-500 hover:text-slate-200 transition-colors"
              href="mailto:myfinancekumail@gmail.com"
            >
              <Mail />
            </a>
          </div>
        </div>
        <div className="space-y-4">
          <h6 className="text-slate-100 font-bold uppercase tracking-widest text-[10px]">
            Halaman
          </h6>
          <ul className="space-y-2">
            <li>
              <a
                className="text-slate-500 hover:text-slate-200 transition-colors"
                href="/coming-soon"
              >
                Harga   
              </a>
            </li>
            <li>
              <a
                className="text-slate-500 hover:text-slate-200 transition-colors"
                href="/coming-soon"
              >
                Blog
              </a>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h6 className="text-slate-100 font-bold uppercase tracking-widest text-[10px]">
            Navigasi Cepat
          </h6>
          <ul className="space-y-2">
            <li>
              <Link
                className="text-slate-500 hover:text-slate-200 transition-colors"
                href="/home#home"
              >
                Beranda
              </Link>
            </li>
            <li>
              <Link
                className="text-slate-500 hover:text-slate-200 transition-colors"
                href="/home#feature"
              >
                Fitur
              </Link>
            </li>
            <li>
              <Link
                className="text-slate-500 hover:text-slate-200 transition-colors"
                href="/home#showcase"
              >
                Showcase
              </Link>
            </li>
            <li>
              <Link
                className="text-slate-500 hover:text-slate-200 transition-colors"
                href="/home#benefit"
              >
                Benefit
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h6 className="text-slate-100 font-bold uppercase tracking-widest text-[10px]">
            Legal
          </h6>
          <ul className="space-y-2">
            <li>
              <TermOnService />
            </li>
            <li>
              <PrivacyPolicy />
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-slate-900 text-center text-slate-500">
        © {currentYear} MyFinanceKu. Precision financial engineering.
      </div>
    </footer>
  );
}
