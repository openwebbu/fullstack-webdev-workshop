const router = require('express').Router()
const User = require('../../models/user')

router.post('/', function(req, res, next) {
    const {username, email, password} = req.body
    if (!username || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'parameters missing'
        })
    }
    const newUser = new User({
        username: username,
        email: email,
        password: password,
    })
    newUser.save(function(err, user) {
        if (err) {
            console.log(err)
            if (err.code === 11000) {
                return res.status(400).json({
                    success: false,
                    err: 'user with the given parameters already exist'
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

router.route('/:id')
    .get(function(req, res) {
        const id = req.params.id
        User.findById(id, function(err, user) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'something terrible happened'
                })
            }
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'place was not found'
                })
            }
            return res.status(200).json({
                success: true,
                data: {
                    username: user.username,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    joined: user.joined,
                }
            })
        })
    })
    .put(function(req, res) {
        const id = req.params.id
        const {password} = req.body
        User.findById(id, function(err, user) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'something terrible happened'
                })
            }
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'user was not found'
                })
            }
            user.password = password || user.password

            user.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'something terrible happened'
                    })
                }
                return res.status(200).json({
                    success: true,
                    message: 'successfully updated the user'
                })
            })
        })
    })
    .delete(function(req, res) {
        const id = req.params.id
        User.findById(id, function(err, user) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'something terrible happened'
                })
            }
            if (!user) {
                return res.status(400).json({
                    success: false,
                    message: 'user was not found'
                })
            }
            user.remove(function(err) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'something terrible happened'
                    })
                }
                return res.status(200).json({
                    success: true,
                    message: 'successfully deleted the user'
                })
            })
        })
    })

module.exports = router