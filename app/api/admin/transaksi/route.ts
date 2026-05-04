import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";  

export async function GET(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DATABASE);
        const transactionsCollection = db.collection("transaksi");

        const data = await transactionsCollection.find({}).sort({ createdAt: -1 }).toArray();

        return NextResponse.json({
            success: true,
            data: data,
            total: data.length,
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        ); 
    }
}