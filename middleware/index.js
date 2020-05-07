const Campground = require('../models/campground')
const Comment = require('../models/comment')

// all the middleware goes here 
const middleware = {
    checkCampgroundOwnership: async function(req, res, next) {
        if (req.isAuthenticated()) {
            try {
                let foundCamp = await Campground.findById(req.params.id)
                if (foundCamp.author.id.equals(req.user.id)) {
                    return next()
                } else {
                    req.flash('error', 'You do not have permission to do that!')
                    res.redirect('back')
                }
            } catch (err) {
                req.flash('error', 'Campground not found!')
                res.redirect('back')
            }
        }
        req.flash('error', 'You need to be logged in!')
        res.redirect('back')
    },

    checkCommentOwnership: async function(req, res, next) {
        if (req.isAuthenticated()) {
            try {
                let foundComm = await Comment.findById(req.params.comment_id)
                if (foundComm.author.id.equals(req.user.id)) {
                    return next()
                } else {
                    req.flash('error', 'You do not have permission to do that!')
                    res.redirect('back')
                }
            } catch (err) {
                req.flash('error', 'Comment not found!')
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