import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const { email, otp, newPassword } = await req.json();

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DATABASE);

  const user = await db.collection("users").findOne({
    $or: [{ email }],
  });

  if (!user || !user.resetOtp || !user.otpExpired) {
    return NextResponse.json(
      { error: "Data tidak valid" },
      { status: 400 }
    );
  }

  if (user.resetOtp !== otp) {
    return NextResponse.json(
      { error: "OTP salah" },
      { status: 400 }
    );
  }

  if (new Date(user.otpExpired) < new Date()) {
    return NextResponse.json(
      { error: "OTP kadaluarsa" },
      { status: 400 }
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await db.collection("users").updateOne(
    { _id: user._id },
    {
      $set: {
        password: hashedPassword,
      },
      $unset: {
        resetOtp: "",
        otpExpired: "",
      },
    }
  );

  return NextResponse.json({
    message: "Password berhasil direset",
  });
}