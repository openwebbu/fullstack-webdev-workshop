const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.get('/register', (req, res, next) => {
    res.render('accounts/sign-up-in', { title: 'Express' })
})

router.post('/register', (req, res, next) => {
    const {username, email, password, password2} = req.body
    if (!username || !email || !password || !password2) {
        return res.status(400).json({
            success: false,
            message: 'missing parameter',
        })
    }
    if (password !== password2) {
        return res.status(400).json({
            success: false,
            message: 'passwords must match',
        })
    }
    const newUser = new User({
        username: username,
        email: email,
        password: password,
    })
    newUser.save(function(err, user) {
        if (err) {
            if (err.code === 11000) {
                return res.status(400).json({
                    success: false,
                    err: 'user with the given parameters already exit'
                })   
            }
            return res.status(400).json({
                success: false,
            })
        }
        return res.status(200).json({
            success: true,
        })
    })
})

router.get('/login', (req, res, next) => {
    res.render('accounts/sign-up-in', { title: 'Express' })
})

router.post('/login', (req, res, next) => {
    const {username, password} = req.body
    if (!username || !password) {
        return res.status(400).json({
            success: false,
            message: 'missing parameter',
        })
    }
    User.findOne({ username: username }, function(err, user) {
        if (err) {
            return res.status(400).json({
                success: false,
                message: err.code,
            })
        }
        user.comparePassword(password, function(err, isMatch) {
            if (err) {
                return res.status(400).json({
                    success: false,
                    message: err.code,
                })
            }
            if (isMatch) {
                req.session.user = user.id
                console.log(req.session)
                return res.status(200).json({
                    success: true,
                })
            }
            return res.status(400).json({
                success: false,
                message: 'incorrect password'
            })
        })
    })
})

module.exports = router