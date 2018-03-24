const authMiddleware = {
    attachUserToResponse: function(req, res, next) {
        if (req.session.user) {
            res.locals.user = req.session.user
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
            res.redirect('/accounts/login')
        }
    }

}

module.exports = authMiddleware