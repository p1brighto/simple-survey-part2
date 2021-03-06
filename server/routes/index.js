"use strict";
var express = require('express');
var sendgrid = require('sendgrid')('ACCOUNT_NAME', 'PASSWORD');
var passport = require('passport');
var router = express.Router();
// db references
var userModel = require('../models/user');
var User = userModel.User;
var surveyModel = require('../models/survey');
var Survey = surveyModel.Survey;
var answerModel = require('../models/answer');
var Answer = answerModel.Answer;
/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {
        title: 'Home',
        displayName: req.user ? req.user.displayName : ''
    });
});
/* GET about page. */
router.get('/about-us', function (req, res, next) {
    res.render('about-us', {
        title: 'About-us',
        displayName: req.user ? req.user.displayName : ''
    });
});
// Show surveys
router.get('/browse-surveys', function (req, res, next) {
    // use the Survey model to query the Surveys collection
    Survey.find(function (error, survey) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // no error, we found a list of surveys
            res.render('browse-surveys', {
                title: 'Browse-surveys',
                survey: survey,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});
/* GET Dashboard */
router.get('/dashboard', function (req, res, next) {
    // use the Survey model to query the Surveys collection
    Survey.find(function (error, survey) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // no error, we found a list of surveys
            res.render('dashboard', {
                title: 'Dashboard',
                survey: survey,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});
/* Get Results */
router.get('/results', function (req, res, next) {
    // use the Survey model to query the Surveys collection
    Survey.find(function (error, surveys) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // no error, we found a list of surveys
            res.render('results', {
                title: 'Results Listing',
                surveys: surveys,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});
router.get('/results/:id', function (req, res, next) {
    var id = req.params.id;
    // use survey id to find related answers
    Answer.find({ surveyId: id }, function (error, answers) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // no error, we found a list of answers
            res.render('answers', {
                title: 'Answers Listing',
                answers: answers,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});
router.get('/results-view', function (req, res, next) {
    // use the Survey model to query the Surveys collection
    Answer.find(function (error, answer) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // no error, we found a list of surveys
            res.render('results-view', {
                title: 'Results Listing',
                answer: answer,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});
/* GET contact page. */
router.get('/contact-us', function (req, res, next) {
    req.flash('successmessage', 'Your message has been submitted. We will get back to you shortly!');
    req.flash('errormessage', 'Oops, something went wrong!');
    res.render('contact-us', {
        title: 'Contact-us',
        messages: null,
        displayName: req.user ? req.user.displayName : ''
    });
});
/* Email processing */
router.post('/contact-us', function (req, res, next) {
    sendgrid.send({
        to: 'anoop.jeewoolall@gmail.com',
        from: req.body.email,
        subject: 'Simple Survey Contact Form',
        text: "This message has been sent from the contact form at [Simple Survey]\r\n\r\n" +
            "Name: " + req.body.name + "\r\n\r\n" +
            "Phone: " + req.body.phone + "\r\n\r\n" +
            req.body.message,
        html: "This message has been sent from the contact form at [Simple Survey]<br><br>" +
            "<strong>Name:</strong> " + req.body.name + "<br><br>" +
            "<strong>Phone:</strong> " + req.body.phone + "<br><br>" +
            req.body.message
    }, function (err, json) {
        if (err) {
            res.status(500).json('error');
        }
        res.render('contact-us', {
            title: 'Contact-us',
            messages: req.flash('successmessage')
        });
    });
});
/* Render Login Page */
router.get('/login', function (req, res, next) {
    if (!req.user) {
        res.render('login', {
            title: 'Login',
            messages: req.flash('loginMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
        return;
    }
    else {
        return res.redirect('/dashboard');
    }
});
/* Process Login Request */
router.post('/login', passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}));
/* Render Password Reset page */
router.get('/reset', function (req, res, next) {
    if (req.user) {
        res.render('reset', {
            title: 'Reset',
            displayName: req.user ? req.user.displayName : ''
        });
    }
    else {
        return res.redirect('/login');
    }
});
/* Process Password Reset Request */
router.post('/reset', function (req, res, next) {
    console.log(req.user.username);
    User.findOne({ 'username': req.user.username }, function (err, user) {
        user.setPassword(req.body.password, function (err) {
            if (err) {
                console.log(err);
                next(err);
            }
            else {
                user.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                    console.log('Password Changed');
                    res.redirect('/users');
                });
            }
        });
    });
});
/* Render Registration page */
router.get('/register', function (req, res, next) {
    if (!req.user) {
        res.render('register', {
            title: 'Register',
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
        return;
    }
    else {
        return res.redirect('/');
    }
});
/* Process Registration Request */
router.post('/register', function (req, res, next) {
    // attempt to register user
    User.register(new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        username: req.body.username,
        displayName: req.body.displayName,
        password: req.body.password,
        email: req.body.email
    }), req.body.password, function (err) {
        if (err) {
            console.log('Error Inserting New Data');
            if (err.name == 'UserExistsError') {
                req.flash('registerMessage', 'Registration Error: User Already Exists!');
            }
            return res.render('register', {
                title: 'Register',
                messages: req.flash('registerMessage'),
                displayName: req.user ? req.user.displayName : ''
            });
        }
        // if registration is successful
        return passport.authenticate('local')(req, res, function () {
            res.redirect('/users');
        });
    });
});
/* Process Logout Request */
router.get('/logout', function (req, res) {
    req.logOut();
    res.redirect('/login');
});
module.exports = router;

//# sourceMappingURL=index.js.map
