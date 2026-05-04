import Link from "next/link";

export default function Navbar() {
  return (
    <div>
      <header className="sticky top-0 z-50 w-full bg-black/60 backdrop-blur-xl border-b border-slate-800/50 shadow-2xl shadow-blue-900/10">
        <nav className="flex justify-between items-center h-16 px-6 md:px-12 max-w-7xl mx-auto text-sm font-medium tracking-tight">
          <div className="text-xl font-bold tracking-tighter text-slate-50">
            MyFinance<span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Ku.</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              className="text-blue-500 dark:text-blue-400 font-semibold transition-colors duration-200"
              href="/home#home"
            >
              Beranda
            </a>
            <a
              className="text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
              href="/home#feature"
            >
              Fitur
            </a>
            <a
              className="text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
              href="/coming-soon"
            >
              Blog
            </a>
            <a
              className="text-slate-400 dark:text-slate-500 hover:text-blue-500 dark:hover:text-blue-400 transition-colors duration-200"
              href="/coming-soon"
            >
              Harga
            </a>
          </div>
          <Link href="/registrasi" className="bg-[#eeefff] cursor-pointer hover:bg-[#eeefff]/50 ease-in-out duration-200  text-black px-5 py-2 rounded-full font-semibold scale-95 active:scale-90 transition-all">
            Coba Versi Beta
          </Link>
        </nav>
      </header>
    </div>
  );
}
