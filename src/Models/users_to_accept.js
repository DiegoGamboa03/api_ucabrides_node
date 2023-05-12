const mongoose = require('mongoose');

const Users_to_acceptSchema = new mongoose.Schema({
  user_recibe_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orden_ruta_id: { type: mongoose.Schema.Types.ObjectId, ref: 'OrdenesRutas' },
}, { collection: 'usuarios_por_aceptar' });

const Users_to_accept = mongoose.model('Users_to_accept', Users_to_acceptSchema);

module.exports = Users_to_accept;