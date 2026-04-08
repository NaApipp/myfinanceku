import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import clientPromise from "@/app/lib/mongodb";

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.userId ? String(payload.userId) : null;

        if (!userId) {
            return NextResponse.json({ message: "Invalid user session" }, { status: 401 });
        }

        const body = await req.json();
        const { 
            nama_kategori
        } = body;

        if (!nama_kategori) {
            return NextResponse.json(
                { message: "field wajib diisi" },
                { status: 400 },
            );
        }

        // Mengambil instance client dari shared koneksi MongoDB (reusable connection)
        const client = await clientPromise;
        // Menghubungkan ke database sesuai konfigurasi di environment variable (.env)
        const db = client.db(process.env.MONGODB_DATABASE);
        // Menentukan koleksi "transaksi" yang akan digunakan untuk operasi data
        const transaksiCollection = db.collection("category");
        // Generate unique ID using random string to avoid collisions if accounts are deleted
        const uniqueId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const idKategori = `KTGR-${userId.slice(-4)}-${uniqueId}`;
        
        // Insert data transaksi
        const transaksi = await transaksiCollection.insertOne({
            userId: String(userId),
            idKategori: String(idKategori),
            nama_kategori: String(nama_kategori),
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
            { status: 201 },
        );
    } catch (error) {
        console.error("Error processing category:", error);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan saat memproses category" },
            { status: 500 },
        );
    }
}

export async function GET(req:NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        const { payload } = await jwtVerify(token, secret);
        const userId = String(payload.userId);

        // Mengambil instance client MongoDB
        const client = await clientPromise;
        // Menghubungkan ke database
        const db = client.db(process.env.MONGODB_DATABASE);
        // Mengakses koleksi "category"
        const categoryCollection = db.collection("category");
        const categories = await categoryCollection.find({ userId }).toArray();
        return NextResponse.json(
            {
                success: true,
                message: "Data Category berhasil diambil",
                data: categories,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error processing category:", error);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan saat memproses category" },
            { status: 500 },
        );
    }
}