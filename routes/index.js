const router = require('express').Router()
const fs = require('fs')

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Home' })
})

// Dynamically loads all routes recursively in the routes directory
function loadRoutes(dir, root) {
    fs.readdirSync(dir).forEach(function(file) {
        if (fs.statSync(`${dir}/${file}`).isDirectory()) {
            loadRoutes(`${dir}/${file}`, `${root}${file}/`)
        }
        else {
            [route, suffix] = file.split('.')
            if (suffix !== 'js' || route === 'index') return
            console.log(`Loading route: ${root}${route}`)
            router.use(`${root}${route}`, require(`.${root}${route}`))
        }
    })
}

loadRoutes(__dirname, '/')

module.exports = router