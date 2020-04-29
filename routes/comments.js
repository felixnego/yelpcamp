const express = require('express')
const Campground = require('../models/campground')
const Comment = require('../models/comment')
const router = express.Router({mergeParams: true})


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

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
                    camp.comments.push(comm)
                    camp.save()
                    res.redirect(`/campgrounds/${id}`)
                }
            })
        }
    })
})

module.exports = router