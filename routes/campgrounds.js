const express = require('express')
const Campground = require('../models/campground')
const router = express.Router()


router.get('/', async (req, res) => {

    const camps = await Campground.find({})

    if (!camps) {
        throw new Error('Could not retrieve camps from database!')
    } else {
        res.render('campgrounds/campgrounds', { campgrounds: camps })
    }
})

router.post('/', (req, res) => {
    let name = req.body.name
    let image = req.body.image
    let description = req.body.description
    let newCampground = { name: name, image: image, description: description }

    Campground.create(newCampground, (err, camp) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/campgrounds');
        }
    })
})

router.get('/new', (req, res) => {
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