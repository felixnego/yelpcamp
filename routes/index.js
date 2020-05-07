const express = require('express')
const passport = require('passport')
const User = require('../models/user')
const router = express.Router()


router.get('/', (req, res) => {
    res.render('landing')
});

// Auth Routes

router.get('/register', (req, res) => {
    res.render('register')
})

router.post('/register', (req, res) => {
    const newUser = new User({ username: req.body.username })
    User.register(newUser, req.body.password, (err, createdUser) => {
        if (err) {
            console.log(err)
            return res.render('register')
        }
        passport.authenticate('local')(req, res, () => {
            res.redirect('/campgrounds')
        })
    })
})

router.get('/login', (req, res) => {
    res.render('login')
})

router.post('/login',
    passport.authenticate(
        'local',
        {
            successRedirect: '/campgrounds',
            failureRedirect: '/login'
        }),
    (req, res) => {
    })

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success', 'Successfully logged out!')
    res.redirect('/campgrounds')
})

module.exports = router