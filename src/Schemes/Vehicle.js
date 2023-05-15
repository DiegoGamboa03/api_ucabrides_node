import mongoose from 'mongoose'

const Schema = mongoose.Schema;

const VehicleSchema = new Schema({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Vehicle', VehicleSchema);