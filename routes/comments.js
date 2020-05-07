const express = require('express')
const Campground = require('../models/campground')
const Comment = require('../models/comment')
const middleware = require('../middleware')
const router = express.Router({mergeParams: true})


// routes
router.get('/new', middleware.isLoggedIn, (req, res) => {
    let id = req.params.id

    Campground.findById(id, (err, camp) => {
        if (err) {
            console.log(err)
        } else {
            res.render('comments/new', { campground: camp })
        }
    })

})

router.post('/', middleware.isLoggedIn, (req, res) => {
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
router.get('/:comment_id/edit', (req, res, next) => {
    middleware.checkOwnership(req, res, next, Comment)
},  async (req, res) => {
    try {
        let currentComment = await Comment.findById(req.params.comment_id)
        let camp = await Campground.findById(req.params.id)
        res.render('comments/edit', {campground: camp, comment: currentComment})
    } catch(err) {
        res.redirect('back')
    }
})

router.put('/:comment_id', (req, res, next) => {
    middleware.checkOwnership(req, res, next, Comment)
}, async (req, res) => {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err, updatedComm) => {
        if (err) {
            res.redirect('back')
        } else {
            res.redirect('/campgrounds/' + req.params.id)
        }
    })
})

// delete
router.delete('/:comment_id', (req, res, next) => {
    middleware.checkOwnership(req, res, next, Comment)
}, (req, res) => {
    Comment.findByIdAndRemove(req.params.comment_id, (err) => {
        if (err) {
            console.log(err)
        }
    })

    res.redirect('/campgrounds/' + req.params.id)
})

module.exports = router