import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";
import z from "zod";

function formatDateWIB(date: Date) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = fmt.formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;

  return `${map.day}/${map.month}/${map.year} ${map.hour}:${map.minute}:${map.second}`;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const registerSchema = z.object({
      first_name: z
        .string()
        .trim()
        .min(1, "Nama depan harus diisi")
        .regex(/^[^0-9]*$/, {
          message: "Nama Tidak boleh mengandung angka",
        }),
      last_name: z
        .string()
        .trim()
        .min(1, "Nama belakang harus diisi")
        .regex(/^[^0-9]*$/, {
          message: "Nama Tidak boleh mengandung angka",
        }),
      // Validasi Email
      email: z.string().trim().email("Format email tidak valid"),

      // Validasi Password
      password: z
        .string()
        .min(6, "Password minimal 6 karakter")
        .regex(/[A-Z]/, "Harus ada huruf besar")
        .regex(/[a-z]/, "Harus ada huruf kecil")
        .regex(/[0-9]/, "Harus ada angka")
        .regex(/[^A-Za-z0-9]/, "Harus ada simbol"),

      // Validasi Username
      username: z
        .string()
        .trim()
        .min(5, "Username minimal 5 karakter")
        .max(30, "Username maksimal 30 karakter")
        .regex(/^[a-zA-Z0-9_]+$/, {
          message: "Hanya boleh mengandung huruf, angka, dan underscore",
        }),

      // Validasi No Hp
      no_hp: z
        .string()
        .trim()
        .min(10, "Nomor HP minimal 10 digit")
        .regex(/^[0-9]+$/, {
          message: "Hanya boleh mengandung angka",
        }),
        
      level: z.string(),
    });

    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        {
          message: validation.error.issues[0].message,
          errors: validation.error.issues,
        },
        { status: 400 },
      );
    }

    const { last_name, first_name, email, password, username, no_hp, level } =
      validation.data;

    const client = await clientPromise;
    // DB and Colecction Name
    const db = client.db(process.env.MONGODB_DATABASE);
    const usersCollection = db.collection("users");

    //  Vakidation check on db email and username
    const existingUser = await usersCollection.findOne({
      $or: [{ email }, { username }],
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email atau Username sudah terdaftar" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Time Format create Account
    const formattedDate = formatDateWIB(new Date());

    // Generate ID based on current document count
    const count = await usersCollection.countDocuments();
    const idUser = `${String(count + 1).padStart(6, "0")}`;

    // Saving New User
    const result = await usersCollection.insertOne({
      idUser,
      first_name,
      last_name,
      full_name: `${first_name} ${last_name}`,
      email,
      password: hashedPassword,
      username,
      no_hp,
      level,
      createdAt: formattedDate,
    });

    return NextResponse.json(
      { message: "Registrasi berhasil", userId: result.insertedId },
      { status: 201 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server" },
      { status: 500 },
    );
  }
}
