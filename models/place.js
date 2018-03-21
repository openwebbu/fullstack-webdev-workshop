const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const Place = new Schema({
    name: {
        type: String,
        required: true,
    },
    slug: {
        type: String,
        index: true,
        require: true,
        unique: true,
    },
    description: String,
    address: String,
    phone: String,
    website: String,
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