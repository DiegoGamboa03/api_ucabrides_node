import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const Emergency_contactSchema = new Schema({
  nombre: { type: String, required: true },
  telefono: { type: String, required: true },
  user_id: { type: Schema.Types.ObjectId, required: true }
});

export default mongoose.model('Emergency_contact', Emergency_contactSchema);