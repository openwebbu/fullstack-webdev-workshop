const express = require('express')
const router = express.Router()
const Place = require('../models/place')

// READ
router.get('/:slug', function(req, res, next) {
    const slug = req.params.slug
    Place.findOne({ slug: slug }, function(err, place) {
        if (err) {
            res.render('error')
        }
        
        if (!place) {
            res.render('places/search')
        }
        res.render('places/place', { place: place, title: place.name })
    })
})

router.get('/search/:q', function(req, res, next) {
    res.render('places/search', {title: 'Search', q: req.params.q})
})

module.exports = router