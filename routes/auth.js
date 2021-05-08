const router = require('express').Router();
const passport = require('passport');
const session = require("express-session");
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const User = require('../models/User');
const isLoggedin = require('../middleware');
//const findOrCreate = require("mongoose-findorcreate");

router.use(
    session({
        secret: "Our little secret.",
        resave: false,
        saveUninitialized: false,
    })
);


// initialization
router.use(passport.initialize());
router.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});



passport.use(new GoogleStrategy({
    clientID: process.env.clientID,
    clientSecret: process.env.clientSecret,
    callbackURL: "http://127.0.0.1:3000/auth/google/callback"
},
    function (accessToken, refreshToken, profile, done) {
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return done(err, user);
        });
    }
));

router.get('/auth/google',
    passport.authenticate('google', { scope: ['email profile'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        // Authenticated successfully
        
        res.redirect('/');
    });

router.get('/', isLoggedin, (req, res) => {
    res.render('index', { user: req.user });
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/logout',  (req, res) => {
    req.logout();
    res.redirect('/');
})

module.exports = router;