import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Coming Soon',
  description: 'Fitur baru segera hadir di MyFinanceKu. Nantikan update terbaru kami!',
}

export default function ComingSoonPage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center px-6 transition-colors duration-300 relative overflow-hidden">

      {/* Subtle animated background grid */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial glow accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-black/5 to-transparent dark:from-white/5 dark:to-transparent blur-3xl pointer-events-none" />

      <section className="relative z-10 max-w-lg w-full text-center">

        {/* Logo */}
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center shadow-sm">
            <Image src="/icon/logo.png" alt="MyFinanceKu Logo" width={45} height={45} />
          </div>
        </div>

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black dark:bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-black dark:bg-white" />
          </span>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 tracking-wide uppercase">
            Dalam Pengembangan
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
          Segera Hadir
        </h1>

        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 mb-8 leading-relaxed max-w-md mx-auto">
          Kami sedang membangun sesuatu yang luar biasa untuk membantu Anda mengelola keuangan dengan lebih baik. Nantikan fitur terbaru dari MyFinanceKu!
        </p>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-white/10 my-8" />

        {/* Footer */}
        <div className="mt-12 text-xs text-gray-400 dark:text-gray-600">
          © {new Date().getFullYear()} MyFinanceKu. All rights reserved.
        </div>

      </section>
    </main>
  )
}