import { NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";

export async function POST(req: Request) {
  const { email } = await req.json();

  const client = await clientPromise;
  const db = client.db(process.env.MONGODB_DATABASE);

  const user = await db.collection("users").findOne({
    $or: [{ email }],
  });

  // response netral (anti enumeration)
  if (!user) {
    return NextResponse.json({
      message: "Jika akun ada, OTP telah dikirim",
    });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  const expired = new Date(Date.now() + 5 * 60 * 1000); // 5 menit

  await db.collection("users").updateOne(
    { _id: user._id },
    {
      $set: {
        resetOtp: otp,
        otpExpired: expired,
      },
    }
  );

  // sementara (debug)
  console.log("OTP:", otp);

  return NextResponse.json({
    message: "Jika akun ada, OTP telah dikirim",
  });
}