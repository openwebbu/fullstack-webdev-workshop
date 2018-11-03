require('dotenv').config()
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const express = require('express')
const index = require('./routes/index')
const path = require('path')
const mongoose = require('mongoose')

const app = express()

mongoose.connect('mongodb://database/open-reviews', { useNewUrlParser: true })

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// connecting middlewares
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/', index)
app.use(function(req, res, next) {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})
app.use(function(err, req, res, next) {
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app