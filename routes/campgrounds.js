const express = require('express')
const Campground = require('../models/campground')
const router = express.Router()


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

router.get('/', async (req, res) => {

    const camps = await Campground.find({})

    if (!camps) {
        throw new Error('Could not retrieve camps from database!')
    } else {
        res.render('campgrounds/campgrounds', { campgrounds: camps })
    }
})

router.post('/', isLoggedIn, (req, res) => {
    let name = req.body.name
    let image = req.body.image
    let description = req.body.description
    let author = {
        id: req.user._id,
        username: req.user.username
    }
    let newCampground = { 
        name: name, 
        image: image, 
        description: description, 
        author: author 
    }

    Campground.create(newCampground, (err, camp) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/campgrounds');
        }
    })
})

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new')
})

// this comes after /new so as not to overwrite
router.get('/:id', (req, res) => {
    let id = req.params.id

    Campground.findById(id).populate('comments').exec((err, camp) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', { campground: camp });
        }
    })
})

module.exports = router