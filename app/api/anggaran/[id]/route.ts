import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import clientPromise from "@/app/lib/mongodb";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const result = await anggaranCollection.deleteOne({
      idAnggaran: id,
      userId: userId,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Anggaran tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Anggaran berhasil dihapus",
    });
  } catch (error) {
    console.error("Error deleting anggaran:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
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

    const result = await anggaranCollection.updateOne(
      { idAnggaran: id, userId: userId },
      { $set: await req.json() }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, message: "Anggaran tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Anggaran berhasil diupdate",
    });
  } catch (error) {
    console.error("Error updating anggaran:", error);
    return NextResponse.json(
      { success: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

