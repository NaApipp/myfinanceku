import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";
import { SignJWT } from "jose";
import { randomUUID } from "crypto";
import { withCors, handleOptions } from "@/app/lib/cors";

export const OPTIONS = handleOptions;

export async function GET(req: NextRequest) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DATABASE);
        const usersCollection = db.collection("users");

        const users = await usersCollection.find().toArray();

        return withCors(NextResponse.json(users, { status: 200 }));
    } catch (error) {
        console.error("Error fetching users:", error);
        return withCors(NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        )); 
    }
}
