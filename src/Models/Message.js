const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
  mensaje: {
    type: String,
    required: true
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true, collection: 'Message' });

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
