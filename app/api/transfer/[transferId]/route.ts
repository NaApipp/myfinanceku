import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/app/lib/mongodb";
import { jwtVerify } from "jose";

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ transferId: string }> }
) {
    try {
        const { transferId } = await params;

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

        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DATABASE);
        const session = client.startSession();

        try {
            await session.withTransaction(async () => {
                // 1. Ambil kedua transaksi yang terhubung dengan transferId ini
                const transactions = await db
                    .collection("transaksi")
                    .find({ transferId, userId }, { session })
                    .toArray();

                if (!transactions || transactions.length === 0) {
                    throw new Error("Transaksi transfer tidak ditemukan");
                }

                // 2. Balikkan saldo untuk setiap transaksi transfer (Akun Asal dan Tujuan)
                for (const transaction of transactions) {
                    // Karena transfer selalu mencatat 'transferDirection' (in/out)
                    // Jika "out" berarti saldo awalnya dikurangi -> sekarang harus ditambah (+nominal)
                    // Jika "in" berarti saldo awalnya ditambah -> sekarang harus dikurangi (-nominal)
                    const reverseValue = 
                        transaction.transferDirection === "out"
                            ? transaction.nominal_transaksi // kembalikan uang ke akun asal
                            : -transaction.nominal_transaksi; // tarik uang dari akun tujuan

                    await db.collection("account-card").updateOne(
                        { idAccount: transaction.idAccount, userId },
                        { $inc: { saldo_awal: reverseValue } },
                        { session }
                    );

                    // Sinkronisasi target (jika ada target untuk kartu/akun tersebut)
                    const updatedAccount = await db.collection("account-card").findOne(
                        { idAccount: transaction.idAccount, userId },
                        { session }
                    );
                    const currentBalance = Number(updatedAccount?.saldo_awal || 0);

                    await db.collection("target").updateMany(
                        { idAccount: transaction.idAccount, userId },
                        { $set: { target_now: currentBalance } },
                        { session }
                    );
                }

                // 3. Hapus kedua transaksi dari database
                await db.collection("transaksi").deleteMany(
                    { transferId, userId },
                    { session }
                );
            });

            return NextResponse.json({ success: true, message: "Transaksi transfer berhasil dihapus" });
        } catch (err: any) {
            throw err; // Lempar ke blok catch utama untuk direturn sebagai respon 500/400
        } finally {
            await session.endSession();
        }

    } catch (err: any) {
        console.error("Error processing transfer delete:", err);
        return NextResponse.json(
            { success: false, message: err.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}