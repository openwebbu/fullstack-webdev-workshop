const mongoose = require('mongoose')
const slugify = require('slugify')
const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const gradients = require('./gradients')

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
    colors: [String],
    reviews: [
        {
            type: ObjectId,
            ref: 'Review'
        }
    ],
    sentimentScoreAvg: {
        type: Number,
        default: 0,
    },
    sentimentMagAvg: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
})

Place.methods.normalizeSentiment = function() {
    const [a, b] = [-1, 1]
    const [c, d] = [0, 100]
    const x = this.sentimentScoreAvg
    return (x - a) * ((d - c) / (b - a)) + c
}

Place.methods.gradient = function() {
    return `linear-gradient(to left, ${this.colors.toString()})`
}

Place.pre('save', function(next) {
    const place = this

    if (place.isNew) {
        const max = gradients.length
        const randomIndex = Math.floor(Math.random() * Math.floor(max))
        place.colors = gradients[randomIndex].colors
    }

    if (!place.isModified('name')) return next()

    const potentialSlug = slugify(place.name, { 
        lower: true,
        remove: /[$*_+~.()'"!\-:@]/g,
    })

    place.constructor.count({ name: place.name }, function(err, count) {
        if (err) return next(err)

        if (count === 0) place.slug = potentialSlug
        else place.slug = `${potentialSlug}-${count + 1}`
        return next()
    })
})

module.exports = mongoose.model('Place', Place)