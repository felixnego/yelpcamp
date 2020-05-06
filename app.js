const express = require('express')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const passport = require('passport')
const localStrategy = require('passport-local')
const User = require('./models/user')
const commentRoutes = require('./routes/comments')
const campgroundRoutes = require('./routes/campgrounds')
const indexRoutes = require('./routes/index')
const methodOverride = require('method-override')
const app = express()


app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))
app.use(express.static(__dirname + '/public'));

app.use(require('express-session')({
    secret: 'Nobody expected the Spanish Inquisition',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

// pass the user to all templates
app.use(function(req, res, next) {
    res.locals.currentUser = req.user
    next()
})

// use the routes
app.use(indexRoutes)
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/comments', commentRoutes)

// seedDB()

mongoose.connect('mongodb://localhost/yelp_camp');


app.listen(3000, ()=> {
    console.log('YelpCamp server has started ...')
});