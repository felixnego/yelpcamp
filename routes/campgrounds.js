const express = require('express')
const Campground = require('../models/campground')
const middleware = require('../middleware')  // a directory can be required if it has index.js
const router = express.Router()


// routes
router.get('/', async (req, res) => {

    const camps = await Campground.find({})

    if (!camps) {
        throw new Error('Could not retrieve camps from database!')
    } else {
        res.render('campgrounds/campgrounds', { campgrounds: camps })
    }
})

router.post('/', middleware.isLoggedIn, (req, res) => {
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

router.get('/new', middleware.isLoggedIn, (req, res) => {
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

// edit
router.get('/:id/edit', middleware.checkCampgroundOwnership, async (req, res) => {
    // try no longer needed
    // error handling in the middleware 
    let foundCamp = await Campground.findById(req.params.id) 
    res.render('campgrounds/edit', { campground: foundCamp })        
})

// update
router.put('/:id', middleware.checkCampgroundOwnership, async (req, res) => {
    let updatedCamp = await Campground.findByIdAndUpdate(req.params.id, req.body.campground)
    res.redirect('/campgrounds/' + req.params.id)
})

// delete
router.delete('/:id', middleware.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err)
        }
    })
    res.redirect('/campgrounds')
})

module.exports = router