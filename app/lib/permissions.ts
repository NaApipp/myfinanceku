// export const LEVEL_PERMISSIONS = {
//   basic: ["transaksi:create"],
//   medium: ["transaksi:create", "target:create"],
//   advance: [
//     "transaksi:create",
//     "target:create",
//     "anggaran:create",
//   ],
// };


// export type Level = keyof typeof LEVEL_PERMISSIONS;
// export type Permission = (typeof LEVEL_PERMISSIONS)[Level][number];

// lib/permissions.ts

export const LEVEL_PERMISSIONS = {
  Basic: ["transaction:create"],
  Medium: ["transaction:create", "target:create"],
  Advanced: [
    "transaction:create",
    "target:create",
    "budget:create",
  ],
} as const;

// Ambil type otomatis dari object
export type Level = keyof typeof LEVEL_PERMISSIONS;

export type Permission =
  (typeof LEVEL_PERMISSIONS)[Level][number];