import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import clientPromise from "@/app/lib/mongodb";
import { z } from "zod";

// Schema Zod
const kategoriSchema = z.object({
    nama_kategori: z
        .string()
        .min(3, "Nama kategori minimal 3 karakter")
        .max(50, "Nama kategori maksimal 50 karakter")
});

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        const { payload } = await jwtVerify(token, secret);

        if (!payload || !payload.userId) {
            return NextResponse.json({ message: "Invalid user session" }, { status: 401 });
        }

        const userId = String(payload.userId);

        const body = await req.json();

        // VALIDASI ZOD
        const result = kategoriSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: result.error.issues[0].message,
                },
                { status: 400 }
            );
        }

        const { nama_kategori } = result.data;

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DATABASE);
        const kategoriCollection = db.collection("category");

        // Cek duplikasi kategori per user
        const existing = await kategoriCollection.findOne({
            userId,
            nama_kategori,
        });

        if (existing) {
            return NextResponse.json(
                { success: false, message: "Kategori sudah ada" },
                { status: 409 }
            );
        }

        const uniqueId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const idKategori = `KTGR-${userId.slice(-4)}-${uniqueId}`;

        await kategoriCollection.insertOne({
            userId,
            idKategori,
            nama_kategori,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Category berhasil ditambahkan",
                data: {
                    idKategori,
                    nama_kategori,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error processing category:", error);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan saat memproses category" },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        const { payload } = await jwtVerify(token, secret);

        if (!payload || !payload.userId) {
            return NextResponse.json({ message: "Invalid user session" }, { status: 401 });
        }

        const userId = String(payload.userId);

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DATABASE);
        const categoryCollection = db.collection("category");

        const categories = await categoryCollection.find({ userId }).toArray();

        return NextResponse.json(
            {
                success: true,
                message: "Data Category berhasil diambil",
                data: categories,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error processing category:", error);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan saat memproses category" },
            { status: 500 }
        );
    }
}