import mongoose from 'mongoose'

const RoutesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lat: { type: String, required: true },
  lng: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: Boolean, default: false },
});

const Routes = mongoose.model('Routes', RoutesSchema);

export default Routes;