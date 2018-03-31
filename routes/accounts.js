const express = require('express')
const router = express.Router()
const User = require('../models/user')

router.route('/register')
    .get(function(req, res, next) {
        res.render('accounts/sign-up', { title: 'Open Reviews - Sign Up' })
    })
    .post(function(req, res, next) {
        const {username, email, password, password2} = req.body
        let data = {
            title: 'Open Reviews - Sign Up',
        }
        if (!username || !email || !password || !password2) {
            data.message = 'Some field is missing'
            return res.render('accounts/sign-up', data)
        }
        if (password !== password2) {
            data.message = 'The passwords must match'
            return res.render('accounts/sign-up', data)
        }
        const newUser = new User({
            username: username,
            email: email,
            password: password,
        })
        newUser.save(function(err, user) {
            if (err) {
                if (err.code === 11000) {
                    data.message = 'User with the given information already exists'
                    return res.render('accounts/sign-up', data)
                }
                data.message = 'Something went wrong on our end...'
                return res.render('accounts/sign-up', data)
            }
            req.session.user = user
            req.session.flash = {
                type: 'success',
                message: 'Successfully registered! Welcome!',
            }
            return res.redirect('/')
        })
    })

router.route('/login')
    .get(function(req, res) {
        res.render('accounts/sign-in', { title: 'Open Reviews - Sign In' })
    })
    .post(function(req, res) {
        const {username, password} = req.body
        let data = {
            title: 'Open Reviews - Sign In',
        }
        if (!username || !password) {
            data.message = 'Username or password is missing'
            return res.render('accounts/sign-in', data)
        }
        User.findOne({ username: username }, function(err, user) {
            if (err) {
                data.message = 'Something went wrong on our end...'
                return res.render('accounts/sign-in', data)
            }
            if (!user) {
                data.message = 'The password you entered is wrong or the user does not exist'
                return res.render('accounts/sign-in', data)
            }
            user.comparePassword(password, function(err, isMatch) {
                if (err) {
                    data.message = 'The password you entered is wrong or the user does not exist'
                    return res.render('accounts/sign-in', data)
                }
                if (isMatch) {
                    req.session.user = user
                    req.session.flash = {
                        type: 'success',
                        message: 'Successfully signed in! Welcome back!',
                    }
                    const returnTo = req.session.returnTo || '/'
                    delete req.session.returnTo
                    return res.redirect(returnTo)
                }
                data.message = 'The password you entered is wrong or the user does not exist'
                return res.render('accounts/sign-in', data)
            })
        })
    })

router.get('/logout', function(req, res) {
    if (req.session.user && req.cookies.user_sid) {
        req.session.destroy(function(err) {
            if (err) {
                return res.redirect('/accounts/login')
            }
            res.clearCookie('user_sid')
            return res.redirect('/')
        })
    } else {
        return res.redirect('/accounts/login')
    }
})

module.exports = router