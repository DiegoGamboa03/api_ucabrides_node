const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  distancia: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  email_verified_at: { type: Date, default: null },
  password: { type: String, default: null },
  avatar: { type: String, default: null },
  external_id: { type: String, default: null },
  status: { type: Number, enum: [1,2], default: 1 }, // 1: no disponible 2: disponible
  remember_token: { type: String, default: null },
}, { timestamps: false });

const User = mongoose.model('User', UserSchema, 'users');

module.exports = User;
