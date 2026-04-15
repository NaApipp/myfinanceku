import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SessionTimeoutHandler from "@/app/components/SessionTimeoutHandler";
import { useEffect } from "react";
import { useRouter } from "next/router";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


const router = useRouter();

  useEffect(() => {
    function handleOffline() {
      router.push("/offline");
    }

    if (!navigator.onLine) {
      router.push("/offline");
    }

    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://myfinanceku.vercel.app"),
  // Judul default website (dipakai kalau halaman tidak override title)
  title: {
    default: "MyFinanceKu",
    template: "%s | MyFinanceKu", // Format judul untuk tiap halaman
  },

  // Deskripsi website (penting untuk SEO)
  description:
    "Aplikasi pencatat keuangan pribadi yang user friendly. Mari kurasi masa depan finansial anda bersama MyFinanceKu",

  // Keyword untuk SEO (opsional, tidak terlalu berpengaruh di search engine modern)
  keywords: [
    "finance",
    "finance tracker",
    "pencatat keuangan",
    "keuangan pribadi",
    "anggaran",
    "target",
    "pengaturan",
    "transaksi",
    "akun",
    "kartu",
    "dompet",
    "keuangan",
    "aplikasi keuangan pribadi",
    "aplikasi pencatatan keuangan",
    "aplikasi keuangan harian",
    "aplikasi pengatur keuangan",
    "personal finance app",
    "money management app",
    "aplikasi catatan keuangan harian gratis",
    "aplikasi keuangan pribadi terbaik",
    "aplikasi pencatat pengeluaran dan pemasukan",
    "cara mengatur keuangan pribadi dengan aplikasi",
    "aplikasi budgeting sederhana",
    "aplikasi keuangan untuk pemula",
    "aplikasi pencatatan keuangan online",
    "cara mencatat pengeluaran harian",
    "cara mengelola keuangan bulanan",
    "sering boros solusi keuangan",
    "aplikasi untuk kontrol pengeluaran",
    "cara menabung lebih efektif",
    "web app keuangan dengan laporan otomatis",
    "web app budgeting dengan grafik",
    "web app pencatat keuangan multi device",
    "web app keuangan sync cloud",
    "web app keuangan tanpa ribet",
    "best personal finance tracker",
    "expense tracker web app",
    "budgeting web app online free",
    "financial planner web app simple",
    "daily expense tracker web app",
  ],

  category: "finance",

  // Informasi pembuat
  authors: [{ name: "Nabil Arif", url: "https://appsporto.vercel.app" }],
  creator: "Nabil Arif",

  // Favicon dan icon untuk berbagai device
  icons: {
    icon: [
      { url: "/icon/logo.png" }, // default favicon
      { url: "/icon/logo.png", sizes: "32x32", type: "image/png" },
      { url: "/icon/logo.png", sizes: "16x16", type: "image/png" },
    ],
    apple: "/icon/logo.png", // icon untuk iOS
  },

  // Open Graph (untuk share ke Facebook, LinkedIn, dll)
  openGraph: {
    title: "MyFinanceKu", // Judul saat di-share
    description: "Kurasi Masa Depan Finansial anda bersama MyFinanceKu", // Deskripsi saat di-share
    url: "https://myfinanceku.vercel.app", // URL utama
    siteName: "MyFinanceKu",
    images: [
      {
        url: "/icon/og-image.png", // Gambar preview
        width: 1200,
        height: 630,
        alt: "Preview Image",
      },
    ],
    locale: "id_ID", // Bahasa / region
    type: "website",
  },

  // Twitter Card (untuk share ke Twitter/X)
  twitter: {
    card: "summary_large_image", // tipe card
    title: "MyFinanceKu",
    description: "Kurasi Masa Depan Finansial anda bersama MyFinanceKu",
    images: ["/icon/og-image.png"],
    creator: "@n_apipppp",
  },

  // Robots (mengatur indexing search engine)
  robots: {
    index: true, // boleh di-index
    follow: true, // boleh follow link
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  // Metadata untuk verifikasi (Google Search Console, dll)
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (_) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <SessionTimeoutHandler />
      </body>
    </html>
  );
}
