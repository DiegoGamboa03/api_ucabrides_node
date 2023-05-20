import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const VehicleSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  marca: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  placa: {
    type: String,
    required: true
  }
});

const Vehicle = mongoose.model('Vehicle', VehicleSchema);

export default Vehicle;