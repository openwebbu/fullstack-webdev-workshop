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
    },
    isAdmin: function(req, res, next) {
        if (req.session.user && req.session.user.isAdmin) {
            next()
        }
        else {
            res.redirect('/')
        }
    }

}

module.exports = authMiddleware