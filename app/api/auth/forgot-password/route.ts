// app/api/forgot-password/route.js
import crypto from 'crypto'
import clientPromise from '@/app/lib/mongodb'
  import { Resend } from 'resend'

export async function POST(req: Request) {
  const { email } = await req.json()

  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DATABASE)

  const user = await db.collection('users').findOne({ email })
  // SECURITY: jangan kasih tahu apakah email ada
  if (!user) {
    return Response.json({ message: 'If email exists, reset link sent' })
  }

  const token = crypto.randomBytes(32).toString('hex')

  await db.collection('users').updateOne(
    { email },
    {
      $set: {
        resetToken: token,
        resetTokenExpiry: new Date(Date.now() + 1000 * 60 * 15) // 15 menit
      }
    }
  )

  const protocol = req.headers.get('x-forwarded-proto') || 'http'
  const host = req.headers.get('host')
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || `${protocol}://${host}`
  const resetLink = `${baseUrl}/reset-password?token=${token}`

  console.log('RESET LINK:', resetLink)

  const resend = new Resend(process.env.RESEND_API_KEY as string)

  await resend.emails.send({
  from: 'myfinanceku@resend.dev',
  to: email,
  subject: 'Reset Password',
  html: `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
    <title>Reset Password</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:20px;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background:#4f46e5;color:#ffffff;padding:20px;text-align:center;font-size:20px;font-weight:bold;">
                MyFinanceKu
              </td>
            </tr>

            <!-- Content -->
            <tr>
              <td style="padding:30px;color:#333333;">
                <h2 style="margin-top:0;">Reset Password</h2>
                <p>Kami menerima permintaan untuk mereset password akun kamu.</p>
                <p>Klik tombol di bawah ini untuk melanjutkan:</p>

                <!-- Button -->
                <div style="text-align:center;margin:30px 0;">
                  <a href="${resetLink}" 
                     style="background:#4f46e5;color:#ffffff;padding:12px 20px;
                            text-decoration:none;border-radius:6px;display:inline-block;
                            font-weight:bold;">
                    Reset Password
                  </a>
                </div>

                <p>Jika tombol tidak bekerja, kamu bisa copy link berikut ke browser:</p>
                <p style="word-break:break-all;color:#4f46e5;">
                  ${resetLink}
                </p>

                <p style="margin-top:30px;">
                  Jika kamu tidak merasa meminta reset password, abaikan email ini.
                </p>

                <p>Terima kasih,<br/>Tim MyFinanceKu</p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f4f4f4;padding:15px;text-align:center;font-size:12px;color:#888;">
                © ${new Date().getFullYear()} MyFinanceKu. All rights reserved.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `,
});

  return Response.json({ message: 'If email exists, reset link sent' })
}