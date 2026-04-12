import clientPromise from "@/app/lib/mongodb";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

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

        const registerSchema = z.object({
            nama_anggaran: z.string().min(1, "Nama anggaran wajib diisi"),
            kategori_anggaran: z.string().min(1, "Kategori anggaran wajib diisi"),
            limit_anggaran: z.coerce
                .number()
                .positive("Limit anggaran tidak boleh negatif")
                .min(1, "Limit anggaran wajib diisi"),
            periode_anggaran: z.string().min(1, "Periode anggaran wajib diisi").refine((val) => {
                const input = new Date(val);
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return input >= today;
            }, { message: "Periode anggaran tidak boleh kurang dari hari ini" }),
        });

        const validation = registerSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { message: validation.error.issues[0].message },
                { status: 400 },
            );
        }

        if (!validation) {
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
            ...validation.data,
        });

        return NextResponse.json(
            {
                success: true,
                message: "Anggaran berhasil ditambahkan",
                data: {
                    idAnggaran,
                    ...validation.data,
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