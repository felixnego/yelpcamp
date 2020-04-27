const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Campground = require('./models/campground')
const Comment = require('./models/comment')
const seedDB = require('./seeds')
const app = express()


app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'));

// seedDB()

mongoose.connect('mongodb://localhost/yelp_camp');

app.get('/', (req, res) => {
    res.render('landing')
});


app.get('/campgrounds', async (req, res) => {

    const camps = await Campground.find({})

    if (!camps) {
        throw new Error('Could not retrieve camps from database!')
    } else {
        res.render('campgrounds/campgrounds', {campgrounds: camps})
    }
})

app.post('/campgrounds', (req, res) => {
    let name = req.body.name
    let image = req.body.image
    let description = req.body.description
    let newCampground = { name: name, image: image, description: description}

    Campground.create(newCampground, (err, camp) => {
        if (err) {
            console.log(err)
        } else {
            res.redirect('/campgrounds');
        }
    });
});

app.get('/campgrounds/new', (req, res) => {
    res.render('campgrounds/new')
})

// this comes after /new so as not to overwrite
app.get('/campgrounds/:id', (req, res) => {
    let id = req.params.id

    Campground.findById(id).populate('comments').exec((err, camp) => {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', { campground: camp });
        }
    }); 
});

app.get('/campgrounds/:id/comments/new', (req, res) => {
    let id = req.params.id

    Campground.findById(id, (err, camp) => {
        if (err) {
            console.log(err)
        } else {
            res.render('comments/new', {campground: camp})
        }
    })
    
})

app.post('/campgrounds/:id/comments/', (req, res) => {
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

app.listen(3000, ()=> {
    console.log('YelpCamp server has started ...')
});