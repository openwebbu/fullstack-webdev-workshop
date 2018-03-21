const router = require('express').Router()
const Place = require('../../models/place')

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
            console.log(err)
            if (err.code === 11000) {
                return res.status(400).json({
                    success: false,
                    err: 'place with the given parameters already exist'
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
        Place.findById(id, function(err, place) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'something terrible happened'
                })
            }
            if (!place) {
                return res.status(400).json({
                    success: false,
                    message: 'place was not found'
                })
            }
            return res.status(200).json({
                success: true,
                data: {
                    name: place.name,
                    description: place.description,
                    address: place.address,
                    phone: place.phone,
                    website: place.website
                }
            })
        })
    })
    .put(function(req, res) {
        const id = req.params.id
        const {name, description, address, phone, website} = req.body
        Place.findById(id, function(err, place) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'something terrible happened'
                })
            }
            if (!place) {
                return res.status(400).json({
                    success: false,
                    message: 'place was not found'
                })
            }
            place.name = name || place.name
            place.description = description || place.description
            place.address = address || place.address
            place.phone = phone || place.phone
            place.website = website || place.website

            place.save(function(err) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'something terrible happened'
                    })
                }
                return res.status(200).json({
                    success: true,
                    message: 'successfully updated the place'
                })
            })
        })
    })
    .delete(function(req, res) {
        const id = req.params.id
        Place.findById(id, function(err, place) {
            if (err) {
                return res.status(500).json({
                    success: false,
                    message: 'something terrible happened'
                })
            }
            if (!place) {
                return res.status(400).json({
                    success: false,
                    message: 'place was not found'
                })
            }
            place.remove(function(err) {
                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: 'something terrible happened'
                    })
                }
                return res.status(200).json({
                    success: true,
                    message: 'successfully deleted the place'
                })
            })
        })
    })

module.exports = router