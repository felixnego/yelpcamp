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
                }
            } catch (err) {
                console.log(err)
                res.redirect('back')
            }
        }
        res.redirect('back')
    },

    checkCommentOwnership: async function(req, res, next) {
        if (req.isAuthenticated()) {
            try {
                let foundComm = await Comment.findById(req.params.comment_id)
                if (foundComm.author.id.equals(req.user.id)) {
                    return next()
                }
            } catch (err) {
                console.log(err)
                res.redirect('back')
            }
        }
        res.redirect('back')
    },

    isLoggedIn: function(req, res, next) {
        if (req.isAuthenticated()) {
            return next()
        }
        res.redirect('/login')
    }
}

module.exports = middleware