const express = require('express')
const router = express.Router()
const Place = require('../models/place')
const auth = require('../middleware/auth')
const Review = require('../models/review')

router.route('/new')
    .get(auth.isAuthenticated, function(req, res) {
        return res.render('places/new-place', {title: 'Add a new place!'})
    })
    .post(function(req, res) {
        const {name, address, phone, website, description} = req.body

        if (!name) {
            return res.render('places/new-place', {
                title: 'Add a new place!',
                flash: {
                    type: 'error',
                    message: 'Place must have a name'
                }
            })
        }

        const newPlace = new Place({
            name: name,
            address: address,
            phone: phone,
            website: website,
            description: description,
        })

        newPlace.save(function(err, place) {
            if (err) {
                req.session.flash = {
                    type: 'error',
                    message: 'Something terrible happened on our end, try in a bit!'
                }
                return res.render('places/new-place', { title: 'Add a new place!'})
            }
            req.session.flash = {
                type: 'success',
                message: 'New place successfully added! Thanks for helping us out!'
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
            populate: { 
                path: 'by'
            }
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

router.route('/:slug/new-review')
    .get(auth.isAuthenticated, function(req, res) {
        const slug = req.params.slug
        Place.findOne({ slug: slug }, function(err, place) {
            if (err || !place) {
                req.session.flash = {
                    type: 'error',
                    message: "Oops... Looks like we couldn't find a place you were trying to review",
                }
                return res.redirect('/')
            }
            res.render('places/new-review', { place: place, title: place.name })
        })
    })
    .post(function(req, res) {
        const slug = req.params.slug
        const user = req.session.user
        let {text} = req.body
        text.replace(/^\s+|\s+$/g, '')

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
                        req.session.flash = {
                            type: 'error',
                            message: 'Something went wrong on our side...'
                        }
                        return res.render('places/new-review', {
                            text: review,
                        })
                    }
                    req.session.flash = {
                        type: 'success',
                        message: 'New review posted! Thanks for helping us out!'
                    }
                    return res.redirect(`/places/${slug}`)
                })
                
            })
        })
    })

router.get('/search/:q', function(req, res, next) {
    const q = req.params.q
    Place
        .find({ name: { $regex: new RegExp(q,'gi') } })
        .populate('reviews')
        .exec(function(err, places) {
            if (err || !places) {
                req.session.flash = {
                    type: 'error',
                    message: 'Something went wrong on our end...',
                }
                return res.redirect('/')
            }
            else {
                res.render('places/search', {title: 'Search', places: places})
            }
        })
})

module.exports = router