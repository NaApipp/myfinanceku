'use client' // hapus baris ini jika pakai Pages Router

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation' // pakai useRouter jika Pages Router
import Link from 'next/link';

// Konten panduan per halaman


const defaultGuide = {
  title: 'Panduan Umum',
  steps: [
    { title: 'Navigasi sidebar', desc: 'Gunakan menu di sebelah kiri untuk berpindah antar fitur.' },
    { title: 'Tambah transaksi', desc: 'Tombol "+ Tambah Transaksi" tersedia di hampir semua halaman.' },
    { title: 'Butuh bantuan lebih?', desc: 'Kunjungi Pengaturan → Bantuan → Pusat Bantuan untuk panduan lengkap.' },
  ],
  tip: 'Kamu bisa mengakses panduan ini kapan saja dari tombol ? di pojok kanan bawah.',
}

export default function HelpButton() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  // Tutup modal saat pindah halaman
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Tutup dengan tombol Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [])


  return (
    <>
      {/* Tombol ? mengambang */}
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Buka panduan penggunaan"
        title="Buka panduan penggunaan"
        className='dark:bg-blue-600 bg-black text-white dark:text-white cursor-pointer'
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          color: '#fff',
          border: 'none',
          fontSize: '20px',
          fontWeight: '600',
          cursor: 'pointer',
          zIndex: 50,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'background 0.2s, transform 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#1d4ed8')}
        onMouseLeave={e => (e.currentTarget.style.background = '#2563eb')}
      >
        <Link
            href="/pengaturan/panduan-penggunaan"
            aria-label="Panduan Penggunaan" 
        >
            ?
        </Link>
      </button>

      
    </>
  )
}