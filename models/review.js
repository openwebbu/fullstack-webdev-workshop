const mongoose = require('mongoose')
const timeAgo = require('time-ago')

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId

const Review = new Schema({
    text: {
        type: String,
        required: true,
    },
    place: {
        type: ObjectId,
        ref: 'Place',
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    }
})

Review.methods.ago = function() {
    return timeAgo.ago(this.created)
}

module.exports = mongoose.model('Review', Review)