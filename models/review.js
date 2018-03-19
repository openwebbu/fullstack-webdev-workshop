const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId

const Review = new Schema({
    owner: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    text: String,
    place: {
        type: ObjectId,
        ref: 'Place',
        required: true,
    },
})

module.exports = mongoose.model('Review', Review)