import type { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Maintenance',
  description: 'Website sedang dalam perbaikan. Silakan kembali beberapa saat lagi.',
  robots: {
    index: false,
    follow: false,
  },
}

export default function MaintenancePage() {
  return (
    <main className="min-h-screen bg-white dark:bg-neutral-950 flex items-center justify-center px-6 transition-colors duration-300 relative overflow-hidden">

      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage:
            'linear-gradient(to right, #000 1px, transparent 1px), linear-gradient(to bottom, #000 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* Radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-black/5 to-transparent dark:from-white/5 dark:to-transparent blur-3xl pointer-events-none" />

      <section className="relative z-10 max-w-lg w-full text-center">

        {/* Logo */}
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 flex items-center justify-center shadow-sm">
            <Image src="/icon/logo.png" alt="MyFinanceKu Logo" width={45} height={45} />
          </div>
        </div>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 mb-6">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
          </span>
          <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 tracking-wide uppercase">
            Sedang Maintenance
          </span>
        </div>

        {/* Heading */}
        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight leading-tight">
          Kami Segera Kembali
        </h1>

        {/* Description */}
        <p className="text-gray-500 dark:text-gray-400 mb-10 leading-relaxed max-w-md mx-auto">
          Kami sedang melakukan peningkatan sistem untuk memberikan pengalaman yang lebih baik. Silakan kembali beberapa saat lagi.
        </p>

        {/* Info cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-10">
          {[
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.76-3.35a1 1 0 010-1.72l5.76-3.35a1.5 1.5 0 011.5 0l5.76 3.35a1 1 0 010 1.72l-5.76 3.35a1.5 1.5 0 01-1.5 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5.66 11.82v4.88a1.5 1.5 0 00.75 1.3l5.17 3a1.5 1.5 0 001.5 0l5.17-3a1.5 1.5 0 00.75-1.3v-4.88" />
                </svg>
              ),
              label: 'Upgrade Sistem',
              desc: 'Infrastruktur lebih baik',
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                </svg>
              ),
              label: 'Keamanan',
              desc: 'Perlindungan data',
            },
            {
              icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                </svg>
              ),
              label: 'Performa',
              desc: 'Lebih cepat & stabil',
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center gap-2 p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/[0.06] transition-all duration-300"
            >
              <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 flex items-center justify-center text-gray-600 dark:text-gray-400">
                {item.icon}
              </div>
              <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.label}</span>
              <span className="text-xs text-gray-500 dark:text-gray-500">{item.desc}</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 dark:border-white/10 my-8" />

        {/* Contact support */}
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
          Ada hal mendesak? Hubungi tim support kami.
        </p>
        <a
          href="mailto:support@myfinanceku.com"
          className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-black dark:bg-white text-white dark:text-black text-sm font-semibold hover:bg-black/80 dark:hover:bg-white/80 transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
          Hubungi Support
        </a>

        {/* Footer */}
        <div className="mt-12 text-xs text-gray-400 dark:text-gray-600">
          © {new Date().getFullYear()} MyFinanceKu. All rights reserved.
        </div>

      </section>
    </main>
  )
}