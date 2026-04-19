# MyFinanceKu

MyFinanceKu adalah sebuah **Web Application** yang dirancang untuk membantu pengelolaan sistem keuangan secara terorganisir dan efisien. Aplikasi ini menyediakan sistem manajemen keuangan yang terstruktur dengan dukungan **multi-role user**, sehingga setiap pengguna memiliki hak akses dan kemampuan yang berbeda sesuai dengan perannya.

MyFinanceKu dibangun menggunakan **Next.js** sebagai framework utama untuk pengembangan aplikasi web modern dan **MongoDB** sebagai sistem manajemen basis data yang stabil dan scalable.

---

## User Testing

**USER 1**

- `Username: user_testing`
- `Password: Testing1#`

**USER 2**

- `Username: testing_user`
- `Password: Testing1#`

---

## Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: (Specify if using NextAuth, Clerk, etc.)
- **Database**: (MongoDB)
- **Deployment**: (Vercel)
- **Version**: (3.0.0)

---

# 4. 🚀 Instalasi

### Prasyarat

- Node.js 18+
- npm atau yarn
- Akun MongoDB Atlas (untuk database)

### Langkah-langkah

1. **Clone repository**

   ```bash
   git clone https://github.com/NaApipp/myfinanceku.git myfinaneku
   cd myfinanceku
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   Buat file `.env` di root folder:

   ```env
   MONGODB_URI=
   MONGODB_DATABASE=
   AUTH_SECRET=
   JWT_SECRET=
   RESEND_API_KEY=
   NEXT_PUBLIC_APP_URL=
   ```

---

## New Commit Format

type (scope/halaman "optional") : Description

option For (type)

- feat: untuk menambahkan fitur baru
- fix: untuk memperbaiki bug
- docs: untuk memperbarui dokumentasi
- style: untuk memperbaiki format atau gaya code
- refactor: untuk merubah penulisan atau memperbaiki
- test: untuk menambahkan atau memperbaiki test
- chore: mengatur task atau perubahan konfigurasi

**Example :** feat (navbar): add dropdown menu

---

## API Documentation

Internal API documentation available for data interaction:

### Auth

| Method | Endpoint                    | Description                       |
| :----- | :-------------------------- | :-------------------------------- |
| `POST` | `/api/auth/login`           | Create a new login data entry.    |
| `POST` | `/api/auth/register`        | Create a new register data entry. |
| `POST` | `/api/auth/logout`          | Delete a new logout data entry.   |
| `POST` | `/api/auth/forgot-password` | Delete a new logout data entry.   |
| `POST` | `/api/auth/reset-password`  | Delete a new logout data entry.   |

### Change Password

| Method | Endpoint                        | Description                              |
| :----- | :------------------------------ | :--------------------------------------- |
| `POST` | `/api/settings/change-password` | Create a new change password data entry. |

### Change Data User

| Method | Endpoint           | Description             |
| :----- | :----------------- | :---------------------- |
| `POST` | `/api/update-user` | Update data user entry. |

### Transaksi

| Method   | Endpoint             | Description               |
| :------- | :------------------- | :------------------------ |
| `POST`   | `/api/transaksi`     | Create a new transaction. |
| `GET`    | `/api/transaksi`     | Get all transactions.     |
| `DELETE` | `/api/transaksi/:id` | Delete transaction by id. |

### Account & Card

| Method   | Endpoint                | Description                   |
| :------- | :---------------------- | :---------------------------- |
| `POST`   | `/api/account-card`     | Create a new account or card. |
| `GET`    | `/api/account-card`     | Get all accounts and cards.   |
| `DELETE` | `/api/account-card/:id` | Delete account or card by id. |
| `PUT`    | `/api/account-card/:id` | Update account or card by id. |

### Target

| Method   | Endpoint                | Description          |
| :------- | :---------------------- | :------------------- |
| `POST`   | `/api/target`           | Create a new target. |
| `GET`    | `/api/target`           | Get all targets.     |
| `DELETE` | `/api/target/:idTarget` | Delete target by id. |
| `PUT`    | `/api/target/:idTarget` | Update target by id. |

### Anggaran

| Method   | Endpoint            | Description            |
| :------- | :------------------ | :--------------------- |
| `POST`   | `/api/anggaran`     | Create a new anggaran. |
| `GET`    | `/api/anggaran`     | Get all anggaran.      |
| `DELETE` | `/api/anggaran/:id` | Delete anggaran by id. |
| `PUT`    | `/api/anggaran/:id` | Update anggaran by id. |

### Kategori

| Method   | Endpoint                    | Description            |
| :------- | :-------------------------- | :--------------------- |
| `POST`   | `/api/kategori`             | Create a new kategori. |
| `GET`    | `/api/kategori`             | Get all kategori.      |
| `DELETE` | `/api/kategori/:idKategori` | Delete kategori by id. |
| `PUT`    | `/api/kategori/:idKategori` | Update kategori by id. |

---