const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const Place = new Schema({
    name: {
        type: String,
        index: true,
        unique: true,
        required: true,
    },
    description: String,
    address: String,
    created: {
        type: Date,
        default: Date.now,
    },
    reviews: [
        {
            type: ObjectId,
            ref: 'Review'
        }
    ]
})

module.exports = mongoose.model('Place', Place)