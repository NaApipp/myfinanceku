# 💰 MyFinanceKu — Professional Personal Finance Management

[![Deployment Status](https://img.shields.io/badge/Status-Beta-orange?style=for-the-badge&logo=vercel)](https://financeku.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-16.2.1-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**MyFinanceKu** adalah solusi manajemen keuangan pribadi tingkat enterprise yang dirancang untuk memberikan transparansi penuh terhadap arus kas Anda. Dibangun dengan teknologi web terbaru untuk memastikan performa maksimal, keamanan data yang ketat, dan pengalaman pengguna yang seamless.

---

## 📑 Daftar Isi

- [Arsitektur & Teknologi](#-arsitektur--teknologi)
- [Fitur Utama](#-fitur-utama)
- [Struktur Proyek](#-struktur-proyek)
- [Keamanan & Otentikasi](#-keamanan--otentikasi)
- [Panduan Instalasi](#-panduan-instalasi)
- [Konfigurasi Environment](#-konfigurasi-environment)
- [Dokumentasi API](#-dokumentasi-api)
- [Kontribusi](#-kontribusi)
- [Lisensi](#-lisensi)

---

## 🏗 Arsitektur & Teknologi

Aplikasi ini mengadopsi paradigma **Modern Web Development** dengan fokus pada efisiensi runtime dan skalabilitas database.

### Core Stack
*   **Framework**: [Next.js 16.2 (App Router)](https://nextjs.org/) — Memanfaatkan React 19 Server Components untuk optimasi rendering.
*   **Language**: [TypeScript](https://www.typescriptlang.org/) — Menjamin *type-safety* di seluruh layer aplikasi.
*   **Database**: [MongoDB](https://www.mongodb.com/) via Native Driver & [Mongoose](https://mongoosejs.com/) — Model data fleksibel dengan performa tinggi.
*   **Styling**: [Tailwind CSS 4.x](https://tailwindcss.com/) — Desain responsif dengan konfigurasi engine terbaru.
*   **Animation**: [Framer Motion](https://www.framer.com/motion/) — Interaksi UI yang halus dan premium.

### Backend & Integrasi
*   **Auth**: [NextAuth.js](https://next-auth.js.org/) & Custom JWT (via `jose`) — Sistem sesi berlapis.
*   **Storage**: [Cloudinary](https://cloudinary.com/) — Manajemen aset media dan profil secara cloud-native.
*   **Email**: [Resend](https://resend.com/) — Pengiriman email transaksional dengan reliabilitas tinggi.
*   **PDF Engine**: [@react-pdf/renderer](https://react-pdf.org/) — Generasi laporan keuangan langsung dari server.

---

## ✨ Fitur Utama

| Fitur | Deskripsi Teknis |
| :--- | :--- |
| **Advanced Dashboard** | Visualisasi data pemasukan, pengeluaran, dan saldo bersih secara real-time. |
| **Multi-Asset Tracking** | Kelola berbagai sumber dana (Bank, E-wallet, Tunai) dalam satu sistem terpusat. |
| **Budgeting Logic** | Sistem limitasi pengeluaran per kategori dengan validasi server-side. |
| **Financial Goals** | Pelacakan progres target tabungan dengan algoritma persentase pencapaian. |
| **Professional Reports** | Ekspor data transaksi ke format PDF dengan layout yang dioptimalkan untuk cetak. |
| **Dynamic UI/UX** | Dark mode support, micro-interactions, dan layout yang sepenuhnya responsif. |

---

## 📂 Struktur Proyek

Mengikuti standar **Next.js App Router** dengan pemisahan tanggung jawab yang modular:

```text
financeku/
├── app/
│   ├── (dashboard)/      # Protected routes: Overview, Transaksi, Anggaran
│   ├── (OnBoarding)/     # Authentication: Login, Register, Forgot Password
│   ├── api/              # RESTful API Route Handlers (Edge-ready)
│   ├── components/       # Atomic Design Components (UI, Shared, Layout)
│   ├── lib/              # Core Logic: Database connections, Services, Utils
│   └── models/           # Schema definitions for MongoDB/Mongoose
├── public/               # Static assets & optimized images
├── tsconfig.json         # Strict TypeScript configuration
├── next.config.ts        # Production-grade Next.js config
└── package.json          # Dependency management & scripts
```

---

## 🔐 Keamanan & Otentikasi

Keamanan adalah prioritas utama dalam pengelolaan data finansial:

1.  **Password Hashing**: Menggunakan `bcryptjs` dengan *salt rounds* standar industri.
2.  **JWT Strategy**: Implementasi JSON Web Tokens menggunakan library `jose` untuk verifikasi stateless yang aman.
3.  **HTTP-Only Cookies**: Menyimpan session tokens di cookie yang tidak dapat diakses oleh client-side JavaScript untuk mencegah XSS.
4.  **CORS Policy**: Proteksi API terhadap request dari domain yang tidak dikenal.
5.  **Schema Validation**: Validasi input data menggunakan `Zod` sebelum masuk ke layer database.

---

## 🚀 Panduan Instalasi

### Prasyarat
- Node.js v18.17+ atau v20.x
- MongoDB Atlas (atau local instance)
- Akun Cloudinary & Resend (untuk fitur lengkap)

### Langkah-langkah
1.  **Clone Repositori**
    ```bash
    git clone https://github.com/username/financeku.git
    cd financeku
    ```

2.  **Instalasi Dependensi**
    ```bash
    npm install --legacy-peer-deps
    ```

3.  **Konfigurasi Environment**
    Buat file `.env` di root directory (lihat bagian [Environment](#-konfigurasi-environment)).

4.  **Menjalankan Development Server**
    ```bash
    npm run dev
    ```
    Akses aplikasi di `http://localhost:3000`.

---

## 🔑 Konfigurasi Environment

Variabel berikut wajib dikonfigurasi agar aplikasi berjalan optimal:

```env
# Database
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/
MONGODB_DATABASE=financeku_db

# Authentication
NEXTAUTH_SECRET=your_nextauth_secret
JWT_SECRET=your_jwt_secret
NEXTAUTH_URL=http://localhost:3000

# Cloudinary (Media)
CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>

# Email Service (Resend)
RESEND_API_KEY=re_123456789

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---


## Dokumentasi API

Seluruh endpoint API bersifat internal dan membutuhkan autentikasi kecuali endpoint auth.

### Autentikasi

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/auth/login` | Login pengguna |
| `POST` | `/api/auth/register` | Registrasi pengguna baru |
| `POST` | `/api/auth/logout` | Logout pengguna |
| `POST` | `/api/auth/forgot-password` | Permintaan reset password |
| `POST` | `/api/auth/reset-password` | Reset password dengan token |

### Transaksi

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/transaksi` | Tambah transaksi baru |
| `GET` | `/api/transaksi` | Ambil semua transaksi |
| `DELETE` | `/api/transaksi/:idTransaksi` | Hapus transaksi berdasarkan ID |
| `GET` | `/api/transaksi/pdf` | Generate laporan transaksi |

### Akun dan Kartu

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/account-card` | Tambah akun atau kartu baru |
| `GET` | `/api/account-card` | Ambil semua akun dan kartu |
| `PUT` | `/api/account-card/:idAccount` | Perbarui akun atau kartu |
| `DELETE` | `/api/account-card/:idAccount` | Hapus akun atau kartu |

### Target Keuangan

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/target` | Tambah target baru |
| `GET` | `/api/target` | Ambil semua target |
| `PUT` | `/api/target/:idTarget` | Perbarui target |
| `DELETE` | `/api/target/:idTarget` | Hapus target |

### Anggaran

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/anggaran` | Tambah anggaran baru |
| `GET` | `/api/anggaran` | Ambil semua anggaran |
| `PUT` | `/api/anggaran/:id` | Perbarui anggaran |
| `DELETE` | `/api/anggaran/:id` | Hapus anggaran |

### Kategori

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/kategori` | Tambah kategori baru |
| `GET` | `/api/kategori` | Ambil semua kategori |
| `PUT` | `/api/kategori/:idKategori` | Perbarui kategori |
| `DELETE` | `/api/kategori/:idKategori` | Hapus kategori |

### Pengaturan Akun

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/settings/change-password` | Ganti password pengguna |
| `POST` | `/api/update-user` | Perbarui data profil pengguna |
| `POST` | `/api/upload` | Upload foto profil pengguna |
| `GET` | `/api/backup` | Backup data pengguna |

---

## 🤝 Kontribusi

Kami menerima kontribusi dalam bentuk *bug reports*, *feature requests*, maupun *pull requests*.

1.  Fork repositori ini.
2.  Buat fitur branch (`git checkout -b feature/AmazingFeature`).
3.  Commit perubahan (`git commit -m 'feat: Add AmazingFeature'`).
4.  Push ke branch (`git push origin feature/AmazingFeature`).
5.  Buka Pull Request.

---

## 📄 Lisensi

Didistribusikan di bawah **MIT License**. Lihat `LICENSE` untuk informasi lebih lanjut.

---

<p align="center">
  Dibuat dengan dedikasi oleh <b>Team MyFinanceKu</b>
</p>