const attachUserToResponse = function(req, res, next) {
    if (req.session.user) {
        res.locals.user = req.session.user
        next()
    }
    else {
        next()
    }
}

module.exports = attachUserToResponse