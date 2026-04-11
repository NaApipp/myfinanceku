// models/User.js
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,

  resetToken: String,
  resetTokenExpiry: Date,
})

export default mongoose.models.User || mongoose.model('User', UserSchema)