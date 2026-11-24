// lib/schemas/register.ts
import { z } from "zod";

export const passwordRules = [
  { id: "length", label: "Minimal 8 karakter", test: (v: string) => v.length >= 8 },
  { id: "upper", label: "Satu huruf besar", test: (v: string) => /[A-Z]/.test(v) },
  { id: "lower", label: "Satu huruf kecil", test: (v: string) => /[a-z]/.test(v) },
  { id: "number", label: "Satu angka", test: (v: string) => /\d/.test(v) },
  { id: "special", label: "Satu karakter spesial", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

export const registerSchema = z.object({
    // Validasi Fullname
        full_name: z
        .string()
        .trim()
        .min(1, "Nama belakang harus diisi")
        .max(50, "Nama belakang maksimal 50 karakter")
        .regex(/^[^0-9]*$/, {
          message: "Nama Tidak boleh mengandung angka",
        }),
        
      // Validasi Email
      email: z
        .string()
        .trim()
        .email("Format email tidak valid")
        .endsWith(
          "@gmail.com",
          "Email hanya bisa menggunakan domain @gmail.com",
        ),

      // Validasi Password
      password: z
        .string()
        .min(6, "Password minimal 6 karakter")
        .regex(/[A-Z]/, "Password harus mengandung huruf besar")
        .regex(/[a-z]/, "Password harus mengandung huruf kecil")
        .regex(/[0-9]/, "Password harus mengandung angka")
        .regex(/[^A-Za-z0-9]/, "Password harus mengandung simbol"),

      // Validasi Username
      username: z
        .string()
        .trim()
        .min(5, "Username minimal 5 karakter")
        .max(30, "Username maksimal 30 karakter")
        .regex(/^[a-zA-Z0-9_]+$/, {
          message: "Username hanya boleh mengandung huruf, angka, dan underscore",
        })
        .refine((val) => !val.includes(" "), {
          message: "Username tidak boleh berisi spasi",
        })
        .refine((val) => val === val.trim(), {
          message: "Username tidak boleh diawali atau diakhiri spasi",
        })
        // Validasi Tidak Boleh Hanya Angka
        .refine((val) => !/^\d+$/.test(val), {
          message: "Username tidak boleh hanya angka",
        }),

      // Validasi Level
      level: z.string(),

      // Validasi Term On Service
      term_on_service: z.boolean().refine((value) => value === true, {
        message: "Anda harus menyetujui syarat dan ketentuan",
      }),

      // Validasi Term On Privacy
      privacy_policy: z.boolean().refine((value) => value === true, {
        message: "Anda harus menyetujui kebijakan privasi",
      }),
    });

export type RegisterValues = z.infer<typeof registerSchema>;