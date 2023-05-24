import mongoose from 'mongoose'

const Near_pointSchema = new mongoose.Schema({
    closestPoint: { type: mongoose.Schema.Types.Mixed, required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

const Near_point = mongoose.model('Near_point', Near_pointSchema, 'punto_cercano');

export default Near_point;