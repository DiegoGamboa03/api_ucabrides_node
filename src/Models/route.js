const mongoose = require('mongoose');

const RoutesSchema = new mongoose.Schema({
  lat: { type: String, required: true },
  lng: { type: String, required: true },
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

const Routes = mongoose.model('Routes', RoutesSchema);

module.exports = Routes;