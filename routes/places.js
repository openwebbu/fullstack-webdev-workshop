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
    const q = req.params.q
    Place.find({ name: { $regex: new RegExp(q,'gi') } }, function(err, places) {
        if (err) {
            return res.status(500).json({
                shit: true,
            })
        }
        if (!places) {
            return res.status(200).json({
                shit: false,
            })
        }
        else {
            res.render('places/search', {title: 'Search', places: places})
        }
    })
})

module.exports = router