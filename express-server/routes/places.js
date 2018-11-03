const express = require('express')
const router = express.Router()
const Place = require('../models/place')
const Review = require('../models/review')

router.route('/new')
    .get(function(req, res) {
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
                return res.render('places/new-place', { title: 'Add a new place!'})
            }
            return res.redirect(`/places/${place.slug}`)
        })
    })

router.get('/:slug', function(req, res) {
    const slug = req.params.slug
    Place
        .findOne({ slug: slug })
        .populate({ path: 'reviews' })
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
    .get(function(req, res) {
        const slug = req.params.slug
        Place.findOne({ slug: slug }, function(err, place) {
            if (err || !place) {
                return res.redirect('/')
            }
            res.render('places/new-review', { place: place, title: place.name })
        })
    })
    .post(function(req, res) {
        const slug = req.params.slug
        let {text} = req.body
        text.replace(/^\s+|\s+$/g, '')

        Place.findOne({ slug: slug }, function(err, place) {
            if (err) {
                res.render('error')
            }
            
            const newReview = new Review({
                text: text,
                place: place,
            })

            newReview.save(function(err, review) {
                if (err) {
                    return res.status(400).json({
                        success: false,
                    })
                }
                place.reviews.push(review)
                
                place.save(function(err, place) {
                    if (err) {
                        return res.render('places/new-review', {
                            text: review,
                        })
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
                return res.redirect('/')
            }
            else {
                res.render('places/search', {title: 'Search', places: places})
            }
        })
})

router.route('/:slug/:id')
    .put(function(req, res) {
        const slug = req.params.slug
        const id = req.params.id
        Place.findOne({ slug: slug }, function(err, place) {
            if (err || !place) {
                return res.json({ success: false })
            }
            Review.findByIdAndUpdate(id, {text: req.body.text}, function(err, review) {
                if (err || !review) {
                    return res.json({ success: false })
                }
                return res.json({ sucess: true })
            })
        })
    })
    .delete(function(req, res) {
        const slug = req.params.slug
        const id = req.params.id
        Place.findOne({ slug: slug }, function(err, place) {
            if (err || !place) {
                return res.json({ success: false })
            }
            Review.findByIdAndRemove(id, function(err, review) {
                if (err || !review) {
                    return res.json({ success: false })
                }
                let index = place.reviews.indexOf(review._id)
                if (index >= 0) {
                    place.reviews.splice(index, 1)
                }
                place.save(function(err, place) {
                    if (err) {
                        return res.json({ success: false })
                    }
                    return res.json({ success: true })
                })
            })
        })
    })

module.exports = router