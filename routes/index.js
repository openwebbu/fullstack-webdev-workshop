const router = require('express').Router()
const fs = require('fs')

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Home' })
})

fs.readdirSync(`${__dirname}/api`).forEach(function(route) {
    [route, suffix] = route.split('.')
    if (suffix !== "js" || route === "index") return;
    console.log(`Loading route: /api/${route}`);
    router.use(`/api/${route}`, require(`./api/${route}`));
})

module.exports = router