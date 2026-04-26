import clientPromise from "@/app/lib/mongodb";
import { withCors, handleOptions } from "@/app/lib/cors";
import { NextRequest, NextResponse } from "next/server";

export const OPTIONS = handleOptions;

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ idUser: string }> }) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DATABASE);
        const usersCollection = db.collection("users");
        const { idUser } = await params;
        const { level } = await req.json();
        // console.log("update");
        const user = await usersCollection.updateOne({ idUser: idUser }, { $set: { level } });
        return withCors(NextResponse.json(user, { status: 200 }));
    } catch (error) {
        console.error("Error updating user:", error);
        return withCors(NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        ));
    }
}