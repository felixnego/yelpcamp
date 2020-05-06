const express = require('express')
const Campground = require('../models/campground')
const router = express.Router()


// middlewares 
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }
    res.redirect('/login')
}

async function checkCampgroundOwnership(req, res, next) {
    if (req.isAuthenticated()) {
        try {
            let foundCamp = await Campground.findById(req.params.id)
            if (foundCamp.author.id.equals(req.user.id)) {
                return next()
            } 
        } catch(err) {
            console.log(err)
            res.redirect('back')
        }
    } 
    res.redirect('back')
}

// routes
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

// edit
router.get('/:id/edit', checkCampgroundOwnership, async (req, res) => {
    // try no longer needed
    // error handling in the middleware 
    let foundCamp = await Campground.findById(req.params.id) 
    res.render('campgrounds/edit', { campground: foundCamp })        
})

// update
router.put('/:id', checkCampgroundOwnership, async (req, res) => {
    let updatedCamp = await Campground.findByIdAndUpdate(req.params.id, req.body.campground)
    res.redirect('/campgrounds/' + req.params.id)
})

// delete
router.delete('/:id', checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndRemove(req.params.id, (err) => {
        if (err) {
            console.log(err)
        }
    })
    res.redirect('/campgrounds')
})

module.exports = router