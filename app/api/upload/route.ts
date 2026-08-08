import { withCors, handleOptions } from "@/app/lib/cors";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import clientPromise from "@/app/lib/mongodb";

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME!,
  api_key: process.env.CLOUD_API_KEY!,
  api_secret: process.env.CLOUD_API_SECRET!,
});

function formatDateWIB(date: Date) {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });

  const parts = fmt.formatToParts(date);
  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;

  return `${map.day}/${map.month}/${map.year} ${map.hour}:${map.minute}:${map.second}`;
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    // validasi
    if (!file || !file.type.startsWith("image/")) {
      return withCors(NextResponse.json({ error: "File harus image" }, { status: 400 }), req);
    }

    if (file.size > 2 * 1024 * 1024) {
      return withCors(NextResponse.json({ error: "Max 2MB" }, { status: 400 }), req);
    }

    // convert ke buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // upload ke cloudinary
    const upload = await new Promise<any>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream({ folder: "finance_ku" }, (err, result) => {
          if (err) reject(err);
          resolve(result);
        })
        .end(buffer);
    });

    if (!upload) {
      throw new Error("Cloudinary upload failed: No result");
    }

    // simpan ke MongoDB
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);

    const result = await db.collection("images").insertOne({
      url: upload.secure_url,
      public_id: upload.public_id,
      createdAt: formatDateWIB,
    });

    // Jika ada username, update profile user
    const username = formData.get("username") as string;
    if (username) {
      await db.collection("users").updateOne(
        { username },
        { $set: { image_url: upload.secure_url } }
      );
    }

    return withCors(NextResponse.json({
      success: true,
      data: {
        _id: result.insertedId,
        url: upload.secure_url,
      },
    }), req);
  } catch (error) {
    console.error("Upload error:", error);
    return withCors(NextResponse.json({ error: "Upload gagal" }, { status: 500 }), req);
  }
}
export const OPTIONS = handleOptions;
