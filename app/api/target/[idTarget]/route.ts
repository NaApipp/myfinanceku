import { NextRequest, NextResponse } from "next/server";
import { deleteTarget } from "@/app/lib/targetService";
import { jwtVerify } from "jose";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ idTarget: string }> }
) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_secret"
    );
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId ? String(payload.userId) : null;

    if (!userId) {
      return NextResponse.json(
        { message: "Invalid user session" },
        { status: 401 }
      );
    }

    const { idTarget } = await params;

    const result = await deleteTarget({
      userId,
      idTarget,
    });

    if (!result.success) {
      return NextResponse.json({ message: result.message }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Target berhasil dihapus" });
  } catch (err: any) {
    console.error("Error deleting target:", err);
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
