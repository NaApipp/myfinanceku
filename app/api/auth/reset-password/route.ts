// app/api/reset-password/route.js
import bcrypt from 'bcryptjs'
import clientPromise from '@/app/lib/mongodb'

export async function POST(req: Request) {
  const { token, password } = await req.json()

  const client = await clientPromise
  const db = client.db(process.env.MONGODB_DATABASE)

  const user = await db.collection('users').findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: new Date() }
  })

  if (!user) {
    return Response.json(
      { message: 'Invalid or expired token' },
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

  return Response.json({ message: 'Password updated' })
}