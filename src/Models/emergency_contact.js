const mongoose = require('mongoose');

const Emergency_contactSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: 'User'
    }
}, {
    collection: 'contacto_sos',
    timestamps: false
});

module.exports = mongoose.model('Emergency_contact', Emergency_contactSchema);