import express = require('express');
var sendgrid = require('sendgrid')('ACCOUNT_NAME', 'PASSWORD');

import passport = require('passport');
var router = express.Router();

// db references
import userModel = require('../models/user');
import User = userModel.User;

import surveyModel = require('../models/survey');
import Survey = surveyModel.Survey;

/* GET home page. */
router.get('/', (req: express.Request, res: express.Response, next: any) => {
  res.render('index', { 
    title: 'Home', 
    displayName: req.user ? req.user.displayName : '' });
});

/* GET about page. */
router.get('/about-us', (req: express.Request, res: express.Response, next: any) => {
  res.render('about-us', { 
    title: 'About-Us',
    displayName: req.user ? req.user.displayName : '' });
});

/* GET browse surveys page. */
router.get('/browse-surveys', (req: express.Request, res: express.Response, next: any) => {
  res.render('browse-surveys', { 
    title: 'Browse-surveys',
    displayName: req.user ? req.user.displayName : '' });
});

/* GET Dashboard */
router.get('/dashboard', (req: express.Request, res: express.Response, next: any) => {
  // use the Survey model to query the Surveys collection
  Survey.find(function(error, survey) {
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

/* GET contact page. */
router.get('/contact-us', (req: express.Request, res: express.Response, next: any) => {
  req.flash('successmessage', 'Your message has been submitted. We will get back to you shortly!');
  req.flash('errormessage','Oops, something went wrong!');
  res.render('contact-us', { 
    title: 'Contact-us',
    messages: null,
    displayName: req.user ? req.user.displayName : '' });
});

/* Email processing */
router.post('/contact-us', (req: express.Request, res: express.Response, next: any) => {
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
  },
  (err, json) => {
    if (err) { res.status(500).json('error'); 
  }
  res.render('contact-us', { 
    title: 'Contact-us',
    messages: req.flash('successmessage')
  });

});
});

/* Render Login Page */
router.get('/login', (req:express.Request, res: express.Response, next:any) => {
  if(!req.user) {
    res.render('login', {
      title: 'Login',
      messages: req.flash('loginMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
    return;
  } else {
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
router.get('/reset', (req:express.Request, res: express.Response, next:any) => {
  if(req.user) {
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
router.post('/reset',(req:express.Request, res: express.Response, next:any) => {
  console.log(req.user.username);
  User.findOne({'username':req.user.username}, (err, user) => {
    user.setPassword(req.body.password, (err) =>{
      if(err) {
        console.log(err);
        next(err);
      } else {
        user.save((err) =>{
          if(err) {
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
router.get('/register', (req:express.Request, res: express.Response, next:any) => {
  if(!req.user) {
    res.render('register', {
      title: 'Register',
      messages: req.flash('registerMessage'),
      displayName: req.user ? req.user.displayName : ''
    });
    return;
  } else {
    return res.redirect('/');
  }
});

/* Process Registration Request */
router.post('/register', (req:express.Request, res: express.Response, next:any) => {

  // attempt to register user
  User.register(new User(
  { 
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    phone: req.body.phone,
    username: req.body.username,
    displayName: req.body.displayName,
    password: req.body.password,
    email: req.body.email
  }), req.body.password, (err) => {
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
      return passport.authenticate('local')(req, res, () => {
        res.redirect('/users');
      });
    });
});

/* Process Logout Request */
router.get('/logout', (req:express.Request, res: express.Response) => {
  req.logOut();
  res.redirect('/login');
});

module.exports = router;