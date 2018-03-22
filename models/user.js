const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const SALT_WORK_FACTOR = parseInt(process.env.SALT_WORK_FACTOR)
const Schema = mongoose.Schema

const User = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    joined: {
        type: Date,
        default: Date.now,
    }
})

User.pre('save', function(next) {
    const user = this
    if (!user.isModified('password')) return next()

    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err)

        bcrypt.hash(user.password, salt).then(hash => {
            user.password = hash
            next()
        }).catch(err => {
            next(err)
        })
    })
})

User.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err)
        cb(null, isMatch)
    })
}

module.exports = mongoose.model('User', User)