# MyFinanceKu

MyFinanceKu adalah aplikasi web manajemen keuangan pribadi yang dirancang untuk membantu pengguna dalam mengelola keuangan mereka secara terorganisir dan efisien. Aplikasi ini menyediakan berbagai fitur pengelolaan keuangan mulai dari pencatatan transaksi harian, pengelolaan akun dan kartu, penetapan target keuangan, hingga pengaturan anggaran per kategori.

Dibangun di atas Next.js dengan dukungan TypeScript, MyFinanceKu menerapkan arsitektur modern berbasis App Router yang menjamin performa tinggi dan pengalaman pengguna yang responsif. Dengan backend yang terintegrasi langsung dalam ekosistem Next.js dan basis data MongoDB, aplikasi ini siap digunakan baik di lingkungan lokal maupun di platform cloud seperti Vercel.

---

## Latar Belakang

Banyak orang kesulitan melacak kondisi keuangan mereka secara real-time karena tidak adanya alat yang mudah digunakan namun tetap komprehensif. Pencatatan manual di buku atau spreadsheet seringkali tidak praktis dan sulit untuk dianalisis. MyFinanceKu hadir sebagai solusi digital yang memungkinkan pengguna mencatat pemasukan dan pengeluaran, menetapkan target tabungan, serta mengatur anggaran agar keuangan pribadi lebih terencana dan terkendali.

---

## Fitur Utama

- **Manajemen Transaksi**: Catat pemasukan dan pengeluaran dengan kategori yang dapat dikustomisasi, serta lihat riwayat transaksi secara lengkap.
- **Manajemen Akun dan Kartu**: Kelola berbagai akun bank maupun kartu yang dimiliki dalam satu dashboard terpusat.
- **Target Keuangan**: Tetapkan target tabungan atau tujuan finansial dan pantau progres pencapaiannya.
- **Anggaran (Budgeting)**: Atur batas pengeluaran per kategori untuk periode tertentu agar keuangan tetap sesuai rencana.
- **Manajemen Kategori**: Buat dan kelola kategori transaksi secara fleksibel sesuai kebutuhan pengguna.
- **Autentikasi Lengkap**: Sistem login, registrasi, logout, lupa password, dan reset password yang aman menggunakan JWT dan NextAuth.
- **Pembaruan Profil Pengguna**: Pengguna dapat memperbarui data profil dan mengganti password kapan saja.
- **Notifikasi Email**: Pengiriman email transaksional (misalnya reset password) menggunakan layanan Resend.
- **Antarmuka Responsif**: Tampilan yang nyaman digunakan di berbagai ukuran layar, dari desktop hingga perangkat mobile.

---

## Teknologi yang Digunakan

| Kategori | Teknologi |
|---|---|
| Framework | Next.js 16 (App Router) |
| Bahasa Pemrograman | TypeScript 5 |
| Styling | Tailwind CSS 4 |
| Database | MongoDB dengan Mongoose |
| Autentikasi | NextAuth v4, JWT (jose, jsonwebtoken) |
| Enkripsi Password | bcrypt / bcryptjs |
| Validasi Data | Zod |
| Upload Media | Cloudinary |
| Pengiriman Email | Resend |
| Icon | Lucide React |
| Linting | ESLint dengan konfigurasi Next.js |
| Deployment | Vercel |

---

## Prasyarat

Sebelum menjalankan project ini, pastikan lingkungan pengembangan Anda memenuhi persyaratan berikut:

- Node.js versi 18 atau lebih baru
- npm atau yarn sebagai package manager
- Akun MongoDB Atlas (atau instance MongoDB lokal)
- Akun Cloudinary untuk pengelolaan upload gambar
- Akun Resend untuk pengiriman email

---

## Instalasi

### 1. Clone Repository

```bash
git clone https://github.com/NaApipp/myfinanceku.git
cd myfinanceku
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Konfigurasi Environment Variables

Buat file `.env.local` di direktori root project, kemudian isi dengan variabel berikut:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/
MONGODB_DATABASE=myfinanceku

AUTH_SECRET=your_nextauth_secret_key
JWT_SECRET=your_jwt_secret_key

RESEND_API_KEY=re_your_resend_api_key

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Penjelasan setiap variabel:

| Variabel | Keterangan |
|---|---|
| `MONGODB_URI` | Connection string MongoDB Atlas atau instance lokal |
| `MONGODB_DATABASE` | Nama database yang digunakan |
| `AUTH_SECRET` | Secret key untuk enkripsi sesi NextAuth |
| `JWT_SECRET` | Secret key untuk penandatanganan token JWT |
| `RESEND_API_KEY` | API key dari layanan Resend untuk pengiriman email |
| `NEXT_PUBLIC_APP_URL` | URL basis aplikasi (ganti dengan domain produksi saat deploy) |

### 4. Jalankan Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`.

---

## Cara Penggunaan

### Akun Testing

Untuk mencoba aplikasi tanpa registrasi, gunakan akun testing berikut:

| Pengguna | Username | Password |
|---|---|---|
| User 1 | `user_testing` | `Testing1#` |
| User 2 | `testing_user` | `Testing1#` |

Atau akses versi live di: [https://myfinanceku.vercel.app](https://myfinanceku.vercel.app)

### Alur Penggunaan Umum

1. Registrasi akun baru atau login menggunakan akun yang sudah ada.
2. Tambahkan akun atau kartu keuangan yang ingin dipantau.
3. Buat kategori transaksi sesuai kebutuhan (misalnya: Makan, Transportasi, Gaji).
4. Catat setiap transaksi pemasukan atau pengeluaran.
5. Tetapkan target keuangan untuk memantau progres tabungan.
6. Atur anggaran per kategori untuk mengendalikan pengeluaran.

---

## Struktur Folder

```
myfinanceku/
├── app/                    # Direktori utama Next.js App Router
│   ├── api/                # Route handler (API endpoints)
│   │   ├── auth/           # Endpoint autentikasi (login, register, dll)
│   │   ├── transaksi/      # Endpoint manajemen transaksi
│   │   ├── account-card/   # Endpoint manajemen akun dan kartu
│   │   ├── target/         # Endpoint manajemen target keuangan
│   │   ├── anggaran/       # Endpoint manajemen anggaran
│   │   ├── kategori/       # Endpoint manajemen kategori
│   │   ├── settings/       # Endpoint pengaturan akun (ganti password)
│   │   └── update-user/    # Endpoint pembaruan data pengguna
│   ├── (pages)/            # Halaman-halaman aplikasi
│   └── layout.tsx          # Root layout aplikasi
├── public/                 # Aset statis (gambar, ikon, dll)
├── .gitignore
├── AGENTS.md               # Panduan untuk AI agent
├── CLAUDE.md               # Konfigurasi khusus Claude AI
├── eslint.config.mjs       # Konfigurasi ESLint
├── next.config.ts          # Konfigurasi Next.js
├── package.json            # Dependensi dan skrip npm
├── postcss.config.mjs      # Konfigurasi PostCSS
└── tsconfig.json           # Konfigurasi TypeScript
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
| `DELETE` | `/api/transaksi/:id` | Hapus transaksi berdasarkan ID |

### Akun dan Kartu

| Method | Endpoint | Deskripsi |
|---|---|---|
| `POST` | `/api/account-card` | Tambah akun atau kartu baru |
| `GET` | `/api/account-card` | Ambil semua akun dan kartu |
| `PUT` | `/api/account-card/:id` | Perbarui akun atau kartu |
| `DELETE` | `/api/account-card/:id` | Hapus akun atau kartu |

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

---

## Testing

Saat ini project belum memiliki automated test suite. Untuk pengujian manual, gunakan akun testing yang telah disediakan atau buat akun baru melalui halaman registrasi.

Untuk menjalankan linting:

```bash
npm run lint
```

---

## Deployment

Aplikasi ini direkomendasikan untuk di-deploy menggunakan [Vercel](https://vercel.com), platform yang dioptimalkan untuk Next.js.

### Langkah Deployment ke Vercel

1. Push kode ke repository GitHub Anda.
2. Buka [https://vercel.com](https://vercel.com) dan login.
3. Klik **Add New Project** dan pilih repository `myfinanceku`.
4. Pada bagian **Environment Variables**, tambahkan semua variabel yang ada di file `.env.local`.
5. Klik **Deploy**.

Setelah deploy berhasil, perbarui variabel `NEXT_PUBLIC_APP_URL` dengan URL domain produksi yang diberikan oleh Vercel.

### Build untuk Produksi (Lokal)

```bash
npm run build
npm run start
```

---

## Kontribusi

Kontribusi sangat disambut untuk meningkatkan kualitas project ini. Berikut panduan untuk berkontribusi:

### Format Commit

Gunakan format berikut untuk setiap commit:

```
<type>(<scope>): <deskripsi singkat>
```

Contoh: `feat(navbar): add dropdown menu`

Daftar tipe commit yang tersedia:

| Tipe | Keterangan |
|---|---|
| `feat` | Menambahkan fitur baru |
| `fix` | Memperbaiki bug |
| `docs` | Memperbarui dokumentasi |
| `style` | Memperbaiki format atau gaya kode (tidak mengubah logika) |
| `refactor` | Refactoring kode tanpa mengubah fungsionalitas |
| `test` | Menambahkan atau memperbaiki test |
| `chore` | Perubahan konfigurasi atau task setup |

### Langkah Kontribusi

1. Fork repository ini.
2. Buat branch baru dari `master`:
   ```bash
   git checkout -b feat/nama-fitur-anda
   ```
3. Lakukan perubahan dan commit sesuai format yang berlaku.
4. Push branch ke fork Anda:
   ```bash
   git push origin feat/nama-fitur-anda
   ```
5. Buat Pull Request ke branch `master` repository utama.
6. Tunggu review dan tanggapan dari maintainer.

---

## Lisensi

Repository ini bersifat privat (`"private": true` dalam `package.json`). Lisensi belum didefinisikan secara eksplisit. Untuk penggunaan lebih lanjut, harap hubungi pemilik repository.

---

## Kontak dan Author

- **GitHub**: [NaApipp](https://github.com/NaApipp)
- **Repository**: [https://github.com/NaApipp/myfinanceku](https://github.com/NaApipp/myfinanceku)
- **Live Demo**: [https://myfinanceku.vercel.app](https://myfinanceku.vercel.app)