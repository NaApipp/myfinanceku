import clientPromise from "@/app/lib/mongodb";
import { withCors, handleOptions } from "@/app/lib/cors";
import { NextRequest, NextResponse } from "next/server";

export const OPTIONS = handleOptions;

export async function PATCH(req: NextRequest, { params }: { params: { idCust: string } }) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DATABASE);
        const usersCollection = db.collection("users");
        const { idCust } = params;
        const { level } = await req.json();
        const user = await usersCollection.updateOne({ idCust }, { $set: { level } });
        return withCors(NextResponse.json(user, { status: 200 }));
    } catch (error) {
        console.error("Error updating user:", error);
        return withCors(NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        ));
    }
}