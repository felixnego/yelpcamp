const express = require('express')
const Campground = require('../models/campground')
const Comment = require('../models/comment')
const router = express.Router({mergeParams: true})

// midleware
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

async function checkCommentOwnership(req, res, next) {
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
}

// routes
router.get('/new', isLoggedIn, (req, res) => {
    let id = req.params.id

    Campground.findById(id, (err, camp) => {
        if (err) {
            console.log(err)
        } else {
            res.render('comments/new', { campground: camp })
        }
    })

})

router.post('/', isLoggedIn, (req, res) => {
    let id = req.params.id
    let comment = req.body.comment

    Campground.findById(id, (err, camp) => {
        if (err) {
            console.log(err)
            res.redirect('/campgrounds')
        } else {
            Comment.create(comment, (err, comm) => {
                if (err) {
                    console.log(err)
                } else {
                    // add username and id to comment and save comment
                    comm.author.id = req.user._id
                    comm.author.username = req.user.username
                    comm.save()
                    // push comment to campground and redirect
                    camp.comments.push(comm)
                    camp.save()
                    res.redirect(`/campgrounds/${id}`)
                }
            })
        }
    })
})

// edit and update
router.get('/:comment_id/edit', checkCommentOwnership,  async (req, res) => {
    try {
        let currentComment = await Comment.findById(req.params.comment_id)
        let camp = await Campground.findById(req.params.id)
        res.render('comments/edit', {campground: camp, comment: currentComment})
    } catch(err) {
        res.redirect('back')
    }
})

router.put('/:comment_id', checkCommentOwnership, async (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComm) => {
        if (err) {
            res.redirect('back')
        } else {
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

// delete
router.delete('/:comment_id', checkCommentOwnership, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            console.log(err)
        }
    })

    res.redirect('/campgrounds/' + req.params.id)
})

module.exports = router