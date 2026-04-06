import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { jwtVerify } from "jose";
import { createTransaction } from "@/app/lib/transactionService";

// export async function POST(req: NextRequest) {
//   try {
//     const token = req.cookies.get("token")?.value;
//     if (!token) {
//       return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
//     const { payload } = await jwtVerify(token, secret);
//     const userId = payload.userId ? String(payload.userId) : null;

//     if (!userId) {
//       return NextResponse.json({ message: "Invalid user session" }, { status: 401 });
//     }

//     const body = await req.json();
//     const {
//       type_transaksi,
//       nominal_transaksi,
//       tanggal_transaksi,
//       kategori,
//       sumberdana,
//       description,
//     } = body;

//     if (!type_transaksi || !nominal_transaksi || !tanggal_transaksi || !kategori || !sumberdana || !description) {
//         return NextResponse.json(
//             { message: "Semua field wajib diisi" },
//             { status: 400 },
//         );
//     }

//     // Mengambil instance client dari shared koneksi MongoDB (reusable connection)
//     const client = await clientPromise;
//     // Menghubungkan ke database sesuai konfigurasi di environment variable (.env)
//     const db = client.db(process.env.MONGODB_DATABASE);
//     // Menentukan koleksi "transaksi" yang akan digunakan untuk operasi data
//     const transaksiCollection = db.collection("transaksi");
//     // Generate ID based on current document count for THIS user
//     const count = await transaksiCollection.countDocuments({ userId });
//     const idTransaksi = `TRX-${userId.slice(-4)}-${String(count + 1).padStart(6, "0")}`;
    
//     // Insert data transaksi
//     const transaksi = await transaksiCollection.insertOne({
//         userId,
//         idTransaksi,
//         type_transaksi,
//         nominal_transaksi,
//         tanggal_transaksi,
//         kategori,
//         sumberdana,
//         description,
//     });

//     return NextResponse.json(
//       {
//         success: true,
//         message: "Transaksi berhasil ditambahkan",
//         data: {
//           idTransaksi,
//           type_transaksi,
//           nominal_transaksi,
//           tanggal_transaksi,
//           kategori,
//           sumberdana,
//           description,
//         },
//       },
//       { status: 201 },
//     );
//   } catch (error) {
//     console.error("Error processing transaksi:", error);
//     return NextResponse.json(
//       { success: false, message: "Terjadi kesalahan saat memproses transaksi" },
//       { status: 500 },
//     );
//   }
// }

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
    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const transaksiCollection = db.collection("transaksi");

    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId ? String(payload.userId) : null;

    if (!userId) {
      return NextResponse.json({ message: "Invalid user session" }, { status: 401 });
    }

    // Generate unique ID using random string to avoid collisions if transactions are deleted
    const uniqueId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const idTransaksi = `TRX-${userId.slice(-4)}-${uniqueId}`;
    const body = await req.json();
    const {
      type_transaksi,
      nominal_transaksi,
      tanggal_transaksi,
      kategori,
      sumberdana: idAccount,
      description,
    } = body;

    if (!type_transaksi || !nominal_transaksi || !tanggal_transaksi || !kategori || !idAccount) {
      return NextResponse.json(
        { message: "Semua field wajib diisi" },
        { status: 400 }
      );
    }

    const result = await createTransaction({
      userId,
      idAccount,
      idTransaksi,
      type_transaksi,
      nominal_transaksi: Number(nominal_transaksi),
      tanggal_transaksi,
      kategori,
      description,
    });

    if (!result.success) {
      return NextResponse.json(
        { message: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({ success: true, message: "Berhasil" });
  } catch (err: any) {
    console.error("Error processing transaksi:", err);
    return NextResponse.json(
      { message: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req:NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
          return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        } 

        

        const secret = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret");
        const { payload } = await jwtVerify(token, secret);
        const userId = payload.userId as string;

        // Mengambil instance client MongoDB
        const client = await clientPromise;
        // Menghubungkan ke database
        const db = client.db(process.env.MONGODB_DATABASE);
        // Mengakses koleksi "transaksi"
        const transaksiCollection = db.collection("transaksi");
        const transaksi = await transaksiCollection.find({ userId }).toArray();

        // const data = await transaksiCollection.find({}).sort({ createdAt: -1 }).toArray();
        return NextResponse.json(
            {
                success: true,
                message: "Data Transaksi berhasil diambil",
                data: transaksi,
            },
            { status: 200 },
        );
    } catch (error) {
        console.error("Error processing transaksi:", error);
        return NextResponse.json(
            { success: false, message: "Terjadi kesalahan saat memproses transaksi" },
            { status: 500 },
        );
    }
}