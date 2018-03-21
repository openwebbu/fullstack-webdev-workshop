const express = require('express')
const router = express.Router()
const Place = require('../models/place')

router.get('/:id', function(req, res, next) {
    res.render('places/place', { title: 'Express' })
})

router.post('/', function(req, res, next) {
    const {name, description, address, phone, website} = req.body
    if (!name) {
        return res.status(400).json({
            success: false,
            message: 'name missing'
        })
    }
    const newPlace = new Place({
        name: name,
        description: description || '',
        address: address || '',
        phone: phone || '',
        website: website || '',
    })
    newPlace.save(function(err, user) {
        if (err) {
            if (err.code === 11000) {
                return res.status(400).json({
                    success: false,
                    err: 'place with the given parameters already exit'
                })   
            }
            console.log(err)
            return res.status(400).json({
                success: false,
            })
        }
        return res.status(200).json({
            success: true,
        })
    })
})

router.get('/search/:q', function(req, res, next) {
    res.render('places/search', {title: 'Search', q: req.params.q})
})

module.exports = router