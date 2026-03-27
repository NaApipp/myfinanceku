"use client";

import Link from "next/link";
import { Wallet, Mail, ArrowLeft } from "lucide-react";
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const year = new Date().getFullYear();
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col justify-between items-center bg-black">
      {/* Logo */}
      <div className="flex gap-2 items-center mt-4">
        <Wallet className="text-lime-500" size={30} />
        <span className="font-bold font-poppins text-2xl text-white">
          MyFinanceKu
        </span>
      </div>

      {/* Main */}
      <div className="flex flex-col items-center">
        <h1 className="text-[120px] text-transparent bg-gradient-to-b from-white to-black bg-clip-text  font-extrabold font-poppins">
          404
        </h1>
        <p className="text-[24px] font-poppins font-medium text-white w-[60%] text-center">
          Halaman ini tidak tersedia. Silakan periksa URL atau kunjungi dasbor
          kami untuk terus memantau pasar.
        </p>
        <p className="text-[20px] font-poppins font-medium text-[#9CA3AF] mt-4 w-[60%] text-center">
          Jika Anda memiliki pertanyaan atau saran untuk kerja sama, silakan
          hubungi kami di.
        </p>
        <div className="flex gap-5 flex-col items-center">
          <Link
            href="mailto:nabilapipp@gmail.com"
            className="flex gap-2 items-center mt-4 bg-gradient-to-b from-white/20 border border-gray-400 to-black p-3 rounded-lg"
          >
            <Mail className="text-lime-500" size={30} />
            <span className="font-bold font-poppins text-[20px]">
              nabilapipp@gmail.com
            </span>
          </Link>
          <button
            onClick={() => router.back()}
            className="flex gap-2 items-center text-[#9CA3AF] hover:text-white transition-colors duration-300 cursor-pointer"
          >
            <ArrowLeft size={15} />
            <span className="font-bold font-poppins text-[14px] ">
              Kembali
            </span>
          </button>
        </div>
      </div>

      {/* FOOTER: */}
      <footer className="text-white/50 w-full mx-auto max-w-screen-xl p-4 md:flex md:flex-row md:items-center md:justify-center flex flex-col justify-center items-center font-poppins font-semibold">
        <span className="text-sm text-center md:text-center">
          &copy; <span>{year}</span>{" "}
          <a
            href="https://www.instagram.com/n_apipppp/"
            className="hover:underline"
          >
            MyFinanceKu
          </a>
          . All Rights Reserved.
        </span>
      </footer>
    </div>
  );
}
