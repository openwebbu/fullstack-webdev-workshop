const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/register', function(req, res, next) {
    res.render('accounts/sign-up-in', { title: 'Express' })
})

router.get('/login', function(req, res, next) {
    res.render('accounts/sign-up-in', { title: 'Express' })
})

module.exports = router