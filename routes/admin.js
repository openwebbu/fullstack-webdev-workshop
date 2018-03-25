const express = require('express')
const router = express.Router()
const Place = require('../models/place')
const authMiddleware = require('../middleware/auth')
const PlaceRequest = require('../models/placeRequest')

router.get('/', authMiddleware.isAdmin, function(req, res) {
    PlaceRequest.find({status: 'pending'}, function(err, requests) {
        if (err) {
            return res.status(500).json({
                message: 'something terrible happened'
            })
        }
        else {
            return res.render('admin/dashboard', {
                requests: requests,
                title: 'Pending requests'
            })
        }
    })
})

router.post('/:id/reject', function(req, res) {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(400).json({
            success: false,
            message: 'no permission'
        })
    }
    else{
        const id = req.params.id
        PlaceRequest.findById(id, function(err, request) {
            request.status = 'rejected'
            request.save(function(err, request) {
                return res.status(200).json({
                    success: true,
                })
            })
        })
    }
})

router.post('/:id/publish', function(req, res) {
    if (!req.session.user || !req.session.user.isAdmin) {
        return res.status(400).json({
            success: false,
            message: 'no permission'
        })
    }
    else{
        const id = req.params.id
        PlaceRequest.findById(id, function(err, request) {
            request.status = 'published'
            request.save(function(err, request) {
                const newPlace = new Place({
                    name: request.name,
                    address: request.address,
                    website: request.website,
                    phone: request.phone,
                    description: request.description,
                })
                
                newPlace.save(function(err, place) {
                    if (err) {
                        return res.status(500).json({
                            success: false,
                        })
                    }
                    else {
                        return res.status(200).json({
                            success: true,
                        })
                    }
                })
            })
        })
    }
})

module.exports = router