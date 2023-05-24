import mongoose from 'mongoose'

const Route_orderSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["activo","cancelado","completado"],
    default: "cancelado"
  },
  route_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Routes'
  },
  vehicle_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Vehicle'
  },
  seats: {
    type: Number,
    required: true
  },
  hour: {
    type: String,
    required: true
  },
  users: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    default: []
  },
}, { collection: 'ordenes_rutas', versionKey: false });

const Route_order = mongoose.model('Route_order', Route_orderSchema);

export default Route_order;