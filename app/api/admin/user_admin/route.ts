import { withCors, handleOptions } from "@/app/lib/cors";
import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function GET(req: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const usersCollection = db.collection("users_admin");

    const users = await usersCollection.find().toArray();

    return withCors(NextResponse.json({
        success: true,
        data: users,
        total: users.length,
    }, { status: 200 }), req);
  } catch (error) {
    console.error("Error fetching users:", error);
    return withCors(NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    ), req); 
  }
}


export const OPTIONS = handleOptions;
