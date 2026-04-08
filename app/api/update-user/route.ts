import clientPromise from "@/app/lib/mongodb";
import { jwtVerify } from "jose";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { first_name, last_name, email, no_hp, username } = body;

    // Ambil token dari body atau cookie
    const token = body.token || request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { message: "Token tidak ditemukan, silakan login kembali" },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_secret"
    );
    
    let userId: string;
    try {
      const { payload } = await jwtVerify(token, secret);
      userId = payload.userId as string;
    } catch (err) {
      return NextResponse.json(
        { message: "Sesi telah berakhir atau token tidak valid" },
        { status: 401 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "Payload token tidak valid" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const usersCollection = db.collection("users");

    // Cari user terlebih dahulu untuk mendapatkan data saat ini
    const existingUser = await usersCollection.findOne({ idUser: userId });
    if (!existingUser) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    // Siapkan data yang akan diupdate
    const updateData: any = {};
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (email !== undefined) updateData.email = email;
    if (no_hp !== undefined) updateData.no_hp = no_hp;
    if (username !== undefined) updateData.username = username;

    // Update full_name jika nama berubah
    if (first_name || last_name) {
      const currentFirstName = first_name ?? existingUser.first_name;
      const currentLastName = last_name ?? existingUser.last_name;
      updateData.full_name = `${currentFirstName} ${currentLastName}`.trim();
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "Tidak ada data yang diubah" },
        { status: 400 }
      );
    }

    const result = await usersCollection.updateOne(
      { idUser: userId },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Gagal memperbarui data user" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Profil berhasil diperbarui",
      user: {
        ...existingUser,
        ...updateData,
        password: undefined, // Jangan kirim password kembali
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat memperbarui profil" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Ambil token dari cookie atau header Authorization
    const token =
      request.cookies.get("token")?.value ||
      request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Token tidak ditemukan, silakan login kembali" },
        { status: 401 }
      );
    }

    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET || "default_secret"
    );

    let userId: string;
    try {
      const { payload } = await jwtVerify(token, secret);
      userId = payload.userId as string;
    } catch (err) {
      return NextResponse.json(
        { message: "Sesi telah berakhir atau token tidak valid" },
        { status: 401 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "Payload token tidak valid" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const usersCollection = db.collection("users");

    const user = await usersCollection.findOne(
      { idUser: userId },
      { projection: { password: 0 } }
    );

    if (!user) {
      return NextResponse.json(
        { message: "User tidak ditemukan" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan server saat mengambil data profil" },
      { status: 500 }
    );
  }
}
