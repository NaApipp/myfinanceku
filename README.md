This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

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

| Method | Endpoint             | Description                       |
| :----- | :------------------- | :-------------------------------- |
| `POST` | `/api/auth/login`    | Create a new login data entry.    |
| `POST` | `/api/auth/register` | Create a new register data entry. |

### Change Password

| Method | Endpoint               | Description                              |
| :----- | :--------------------- | :--------------------------------------- |
| `POST` | `/api/settings/change-password` | Create a new change password data entry. |

### Change Data User

| Method | Endpoint                | Description             |
| :----- | :---------------------- | :---------------------- |
| `POST` | `/api/settings/change-data-user` | Update data user entry. |

### Transaksi

| Method    | Endpoint             | Description                        |
| :-------- | :------------------- | :--------------------------------- |
| `POST`    | `/api/transaksi`     | Create a new transaksi data entry. |
| `GET`     | `/api/transaksi`     | Get all transaksi data entry.      |
| `GET`     | `/api/transaksi/:id` | Get transaksi data entry by id.    |
| ` DELETE` | `/api/transaksi/:id` | Get transaksi data entry by id.    |
| ` PUT`    | `/api/transaksi/:id` | Get transaksi data entry by id.    |

### Account & Card

| Method    | Endpoint                | Description                        |
| :-------- | :---------------------- | :--------------------------------- |
| `POST`    | `/api/account-card`     | Create a new transaksi data entry. |
| `GET`     | `/api/account-card`     | Get all transaksi data entry.      |
| `GET`     | `/api/account-card/:id` | Get transaksi data entry by id.    |
| ` DELETE` | `/api/account-card/:id` | Get transaksi data entry by id.    |
| ` PUT`    | `/api/account-card/:id` | Get transaksi data entry by id.    |
