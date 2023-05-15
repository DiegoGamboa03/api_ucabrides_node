import mongoose from 'mongoose'

const Route_orderSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["activo","cancelado","completado"],
    default: "cancelado"
  },
  route_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Rutas'
  }
}, { collection: 'ordenes_rutas', versionKey: false });

const Route_order = mongoose.model('Route_order', Route_orderSchema);

module.exports = Route_order;