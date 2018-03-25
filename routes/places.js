const express = require('express')
const router = express.Router()
const Place = require('../models/place')
const authMiddleware = require('../middleware/auth')
const Review = require('../models/review')
const PlaceRequest = require('../models/placeRequest')

router.get('/new', authMiddleware.isAuthenticated, function(req, res) {
    res.render('places/new-place', { title: 'Request a new place!'})
})

router.post('/new', function(req, res) {
    const user = req.session.user
    const {name, address, phone, website, description} = req.body
    const newRequest = new PlaceRequest({
        name: name,
        address: address,
        phone: phone,
        website: website,
        description: description,
        by: user,
    })

    newRequest.save(function(err, request) {
        if (err) {
            console.log(err)
            return res.render('places/new-place', { title: 'Request a new place!' })
        }
        return res.redirect('/')
    })
})

router.get('/:slug', function(req, res) {
    const slug = req.params.slug
    Place
        .findOne({ slug: slug })
        .populate({
            path: 'reviews',			
            populate: { path:  'by',
                        model: 'User' }
        })
        .exec(function(err, place) {

            if (err) {
                res.render('error')
            }
            
            if (!place) {
                res.render('places/search')
            }
            res.render('places/place', { place: place, title: place.name })
        })
})

router.get('/:slug/new-review', authMiddleware.isAuthenticated, function(req, res) {
    const slug = req.params.slug
    Place.findOne({ slug: slug }, function(err, place) {
        if (err) {
            res.render('error')
        }
        
        if (!place) {
            res.render('places/search')
        }
        res.render('places/new-review', { place: place, title: place.name })
    })
})

router.post('/:slug/new-review', function(req, res) {
    const slug = req.params.slug
    const user = req.session.user
    const {text} = req.body

    Place.findOne({ slug: slug }, function(err, place) {
        if (err) {
            res.render('error')
        }
        
        const newReview = new Review({
            by: user,
            text: text,
            place: place,
        })

        newReview.save(function(err, review) {
            if (err) {
                console.log(err)
                return res.status(400).json({
                    success: false,
                })
            }
            place.reviews.push(review)
            let scoreSum = place.sentimentScoreAvg * place.numReviews + newReview.sentimentScore
            let magSum = place.sentimentMagAvg * place.numReviews + newReview.sentimentMag
            place.numReviews += 1
            place.sentimentScoreAvg = scoreSum / place.numReviews
            place.sentimentMagAvg = magSum / place.numReviews

            place.save(function(err, place) {
                if (err) {
                    return res.send('oh no')
                }
                return res.redirect(`/places/${slug}`)
            })
            
        })
    })
})

router.get('/search/:q', function(req, res, next) {
    const q = req.params.q
    Place.find({ name: { $regex: new RegExp(q,'gi') } })
         .populate('reviews')
         .exec(function(err, places) {
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