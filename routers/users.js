const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const passport = require('passport');


const User = require('../models/user'); // Import User Model Schema


router.get('/login', (req, res) => res.render("login"));


router.get('/register', (req, res) => res.render("register"));

//register handle
router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    let errors = [];
    if (!name || !email || !password) {
        errors.push({ msg: 'Please enter all fields' });
    }
    if (password !== password2){
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({msg: 'password should not be less than 6 characters'});
    }
    if (errors.length > 0) {
        res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
    } else {
        User.findOne({ email: email })
        .then(user => {
            if(user) {
                // User exixts
                errors.push({ msg: 'Email already exists' });
                res.render('register', {
                    errors,
                    name,
                    email,
                    password,
                    password2
                });
            }else{
                const newuser = new User({
                    name,
                    email,
                    password
                });

                bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newuser.password, salt, (err, hash) => {
                    if (err) throw err;
                    // Set password to hashed
                    newuser.password = hash;
                    // Save user
                    newuser.save()
                        .then(user => {
                            req.flash('success_msg', 'You are now registered and can log in');
                            res.redirect('/users/login');
                        })
                        .catch(err => console.log(err));
                }))
            }
        })
    }

});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next);
});


router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
});

module.exports = router;