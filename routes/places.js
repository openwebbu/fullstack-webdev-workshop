const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/:id', (req, res, next) => {
    res.render('places/place', { title: 'Express' })
})

router.get('/search/:q', (req, res, next) => {
    res.render('places/search', {title: 'Search'})
})

module.exports = router