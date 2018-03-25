const mongoose = require('mongoose')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const PlaceRequest = new Schema({
    name: {
        type: String,
        required: true,
    },
    description: String,
    address: String,
    phone: String,
    website: String,
    created: {
        type: Date,
        default: Date.now,
    },
    by: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'published', 'rejected'],
        required: true,
        default: 'pending',
    }
})

module.exports = mongoose.model('PlaceRequest', PlaceRequest)