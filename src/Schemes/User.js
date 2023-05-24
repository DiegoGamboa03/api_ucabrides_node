import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  distance: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, default: null },
  avatar: { type: String, default: null },
  external_id: { type: String, default: null },
  status: { type: mongoose.Schema.Types.Mixed, required: true },
  score: { type: Number, default: 0},
  address: { type: mongoose.Schema.Types.Mixed, default: null},
  phoneNumber: { type: String, required: true}
}, { timestamps: false });

const User = mongoose.model('User', UserSchema);

export default User;
