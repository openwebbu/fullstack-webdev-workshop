const authMiddleware = {
    attachUserToResponse: function(req, res, next) {
        if (req.session.user) {
            res.locals.user = req.session.user
            res.locals.flash = req.session.flash
            delete req.session.flash
            next()
        }
        else {
            next()
        }
    },
    isAuthenticated: function(req, res, next) {
        if (req.session.user) {
            next()
        }
        else {
            req.session.returnTo = req.originalUrl
            res.redirect('/accounts/login')
        }
    },
}

module.exports = authMiddleware