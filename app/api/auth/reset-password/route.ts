// app/api/reset-password/route.js
import bcrypt from 'bcryptjs'
import clientPromise from '@/app/lib/mongodb'
import z from 'zod'

export async function POST(req: Request) {
  const body = await req.json()

  const resetPasswordSchema = z.object({
    token: z.string(),
    password: z
      .string()
      .min(6, "Password minimal 6 karakter")
      .regex(/[A-Z]/, "Harus ada huruf besar")
      .regex(/[a-z]/, "Harus ada huruf kecil")
      .regex(/[0-9]/, "Harus ada angka")
      .regex(/[^A-Za-z0-9]/, "Harus ada simbol"), 
  })

  const validation = resetPasswordSchema.safeParse(body)

  if (!validation.success) {
    // Ambil pesan error pertama dari Zod
    const errorMessage = validation.error.issues[0].message;
    return Response.json(
      { message: errorMessage },
      { status: 400 }
    )
  }

  const { token, password } = validation.data;

  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DATABASE)

  const user = await db.collection('users').findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: new Date() }
  })

  if (!user) {
    return Response.json(
      { message: 'Token Telah Expired' },
      { status: 400 }
    )
  }

  const hashedPassword = await bcrypt.hash(password, 10)

  await db.collection('users').updateOne(
    { _id: user._id },
    {
      $set: { password: hashedPassword },
      $unset: {
        resetToken: "",
        resetTokenExpiry: ""
      }
    }
  )

  return Response.json({ message: 'Password Berhail diubah' })
}