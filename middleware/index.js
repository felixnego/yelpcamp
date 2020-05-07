const Campground = require('../models/campground')
const Comment = require('../models/comment')

// all the middleware goes here 
const middleware = {
    checkOwnership: async function(req, res, next, entity) {
        if (req.isAuthenticated()) {
            try {
                let foundEntity = await entity.findById(req.params.id)
                if (foundEntity.author.id.equals(req.user.id)) {
                    return next()
                } else {
                    req.flash('error', 'You do not have permission to do that!')
                    res.redirect('back')
                }
            } catch (err) {
                req.flash('error', 'Entity not found!')
                res.redirect('back')
            }
        }
        req.flash('error', 'You need to be logged in!')
        res.redirect('back')
    },

    isLoggedIn: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        req.flash('error', 'Please log in first!')
        res.redirect('/login')
    }
}

module.exports = middleware