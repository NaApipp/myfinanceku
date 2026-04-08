import clientPromise from "@/app/lib/mongodb";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        const { payload } = await jwtVerify(token, secret);
        const userId = String(payload.userId);

        const body = await req.json();
        const {
            nama_anggaran,
            kategori_anggaran,
            limit_anggaran,
            periode_anggaran,
        } = body;

        if (!nama_anggaran || !kategori_anggaran || !limit_anggaran || !periode_anggaran) {
            return NextResponse.json(
                { message: "Semua field wajib diisi" },
                { status: 400 },
            );
        }

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DATABASE);
        const anggaranCollection = db.collection("anggaran");
        const uniqueId = Math.random().toString(36).substring(2, 8).toUpperCase();
        const idAnggaran = `BUDGET-${userId.slice(-4)}-${uniqueId}`;

        const anggaranData = await anggaranCollection.insertOne({
            userId: String(userId),
            idAnggaran: String(idAnggaran),
            nama_anggaran: String(nama_anggaran),
            kategori_anggaran: String(kategori_anggaran),
            limit_anggaran: Number(limit_anggaran),
            periode_anggaran: String(periode_anggaran),
        });

        return NextResponse.json(
            {
                success: true,
                message: "Anggaran berhasil ditambahkan",
                data: {
                    idAnggaran,
                    nama_anggaran,
                    kategori_anggaran,
                    limit_anggaran,
                    periode_anggaran,
                },
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("Error processing anggaran:", error);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan saat memproses anggaran" },
            { status: 500 },
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
        const userId = String(payload.userId);

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DATABASE);
        const anggaranCollection = db.collection("anggaran");
        const anggaranData = await anggaranCollection.find({ userId }).toArray();
        return NextResponse.json(
            {
                success: true,
                message: "Data Anggaran berhasil diambil",
                data: anggaranData,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error processing anggaran:", error);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan saat memproses anggaran" },
            { status: 500 },
        );
    }
}