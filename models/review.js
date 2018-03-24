const mongoose = require('mongoose')
const language = require('@google-cloud/language')
const timeAgo = require('time-ago')

const Schema = mongoose.Schema
const ObjectId = Schema.Types.ObjectId
const client = new language.LanguageServiceClient({
    projectId: process.env.GCLOUD_PROJECT_ID,
    keyFilename: process.env.GLOUD_KEYFILE_PATH,
})

const Review = new Schema({
    by: {
        type: ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    place: {
        type: ObjectId,
        ref: 'Place',
        required: true,
    },
    sentimentScore: {
        type: Number,
    },
    sentimentMag: {
        type: Number,
    },
    created: {
        type: Date,
        default: Date.now,
    }
})

Review.methods.ago = function() {
    return timeAgo.ago(this.created)
}

Review.pre('save', function(next) {
    const review = this

    if (!review.isModified('text')) next()

    const document = {
        content: review.text,
        type: 'PLAIN_TEXT',
    }

    client
        .analyzeSentiment({document: document})
        .then(results => {
            const sentiment = results[0].documentSentiment;

            review.sentimentScore = sentiment.score
            review.sentimentMag = sentiment.magnitude
            next()
        })
        .catch(err => {
            next(err)
        })
})

module.exports = mongoose.model('Review', Review)