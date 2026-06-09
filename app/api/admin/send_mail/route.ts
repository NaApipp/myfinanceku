import { NextResponse } from "next/server";
import { Resend } from "resend";
import clientPromise from "@/app/lib/mongodb";

const resend = new Resend(process.env.RESEND_EMAIL_INFORMATION);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { mode, userIds, subject, message, senderName } = body;

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject dan pesan wajib diisi." },
        { status: 400 },
      );
    }

    const client = await clientPromise;
    const db = client.db(process.env.MONGODB_DATABASE);
    const usersCollection = db.collection("users");

    let recipients = [];

    if (mode === "broadcast") {
      // Ambil semua user
      const users = await usersCollection
        .find({}, { projection: { email: 1, full_name: 1, _id: 1 } })
        .toArray();
      recipients = users;
    } else if (
      mode === "targeted" &&
      Array.isArray(userIds) &&
      userIds.length > 0
    ) {
      // Ambil user berdasarkan idUser (string)
      const users = await usersCollection
        .find(
          { idUser: { $in: userIds } },
          { projection: { email: 1, full_name: 1, idUser: 1, _id: 1 } },
        )
        .toArray();
      recipients = users;
    } else {
      return NextResponse.json(
        { error: "Mode tidak valid atau tidak ada user yang dipilih." },
        { status: 400 },
      );
    }

    if (recipients.length === 0) {
      return NextResponse.json(
        { error: "Tidak ada penerima yang ditemukan." },
        { status: 404 },
      );
    }

    // Kirim email ke semua penerima
    const emailPromises = recipients.map((user) =>
      resend.emails.send({
        from: `${senderName || "MyFinanceKu Info"} <noreply@resend.dev>`,
        to: user.email,
        subject: subject,
        html: buildEmailTemplate({
          name: user.full_name,
          subject,
          message,
        }),
      }),
    );

    const results = await Promise.allSettled(emailPromises);

    const succeeded = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return NextResponse.json({
      success: true,
      summary: {
        total: recipients.length,
        succeeded,
        failed,
      },
    });
  } catch (error) {
    console.error("Send email error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan pada server." },
      { status: 500 },
    );
  }
}

function buildEmailTemplate({
  name,
  subject,
  message,
}: {
  name: string;
  subject: string;
  message: string;
}) {
  // Ubah newline menjadi <br> untuk HTML
  const htmlMessage = message.replace(/\n/g, "<br />");

  return `
    <!DOCTYPE html>
    <html lang="id">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>${subject}</title>
      </head>
      <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:'Segoe UI',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6f9;padding:40px 0;">
          <tr>
            <td align="center">
              <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.06);">
                
                <!-- Header -->
                <tr>
                  <td align="center" style="background:#ffffff; padding:28px 40px; border-bottom:1px solid #e5e7eb;">
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 auto;">
                      <tr>
                        <td valign="middle" style="padding-right:12px;">
                          <img src="https://myfinanceku.vercel.app/icon/logo.png" alt="Logo" style="width:48px; height:auto; display:block; margin:0; padding:0;">
                        </td>
                        <td valign="middle">
                          <p style="margin:0;color:#111827;font-size:24px;font-weight:700;letter-spacing:-0.3px;">
                            <span style="color:#1a56db;font-weight:700;">MyFinance</span>Ku
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:36px 40px 28px;">
                    <p style="margin:0 0 16px;color:#111827;font-size:16px;">
                      Halo, <strong>${name}</strong>
                    </p>
                    <div style="color:#374151;font-size:15px;line-height:1.7;border-left:3px solid #1a56db;padding-left:16px;margin:20px 0;">
                      ${htmlMessage}
                    </div>
                  </td>
                </tr>

                <!-- Divider -->
                <tr>
                  <td style="padding:0 40px;">
                    <hr style="border:none;border-top:1px solid #e5e7eb;" />
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="padding:24px 40px 36px;">
                    <p style="margin:0;color:#6b7280;font-size:13px;line-height:1.6;">
                      Email ini dikirim oleh tim <strong>MyFinanceKu</strong>.<br/>
                      Jika kamu merasa tidak seharusnya menerima email ini, abaikan saja.
                    </p>
                  </td>
                </tr>

              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `;
}
