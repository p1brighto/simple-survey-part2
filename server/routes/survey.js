"use strict";
var express = require('express');
var router = express.Router();
var surveyModel = require('../models/survey');
var Survey = surveyModel.Survey;
/* Utility Function to check if user is authenticated */
function requireAuth(req, res, next) {
    // check if the user is logged in
    if (!req.isAuthenticated()) {
        return res.redirect('/login');
    }
    next();
}
// GET - show main survey page
router.get('/', requireAuth, function (req, res, next) {
    // use the Survey model to query the Surveys collection
    Survey.find(function (error, survey) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            // no error, we found a list of surveys
            res.render('survey/index', {
                title: 'Survey',
                survey: survey,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});
/* GET browse surveys page. */
/*router.get('/browse-surveys', (req: express.Request, res: express.Response, next: any) => {
  res.render('browse-surveys', {
    title: 'Browse-surveys',
    displayName: req.user ? req.user.displayName : ''
  });
});*/
// Show page with survey options to create
router.get('/add', requireAuth, function (req, res, next) {
    res.render('survey/add', {
        title: 'Choose your type of survey',
        displayName: req.user ? req.user.displayName : ''
    });
});
// GET add page - show the blank form
router.get('/shortquestions-add', requireAuth, function (req, res, next) {
    res.render('survey/shortquestions-add', {
        title: 'Add Short Questions',
        displayName: req.user ? req.user.displayName : ''
    });
});
// POST add page - save the new survey
router.post('/shortquestions-add', function (req, res, next) {
    Survey.create({
        surveyTitle: req.body.surveyTitle,
        SurveyType: req.body.surveyType,
        shortQuest1: req.body.shortQuest1,
        shortQuest2: req.body.shortQuest2,
        shortQuest3: req.body.shortQuest3,
        shortQuest4: req.body.shortQuest4,
        shortQuest5: req.body.shortQuest5,
        displayName: req.body.displayName
    }, function (error, Survey) {
        // did we get back an error or valid Survey object?
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            res.redirect('/dashboard');
        }
    });
});
// GET edit page - show the current survey in the form
router.get('/:id', function (req, res, next) {
    var id = req.params.id;
    Survey.findById(id, function (error, survey) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            //show the edit view
            res.render('survey/edit', {
                title: 'Survey Details',
                survey: survey,
                displayName: req.user ? req.user.displayName : ''
            });
        }
    });
});
// POST edit page - update the selected survey
router.post('/:id', function (req, res, next) {
    // grab the id from the url parameter
    var id = req.params.id;
    // create and populate an survey object
    var survey = new Survey({
        _id: id,
        surveyTitle: req.body.surveyTitle,
        surveyContent: req.body.surveyContent,
        idName: req.body.idName
    });
    // run the update using mongoose and our model
    Survey.update({ _id: id }, survey, function (error) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            res.redirect('/survey');
        }
    });
});
// GET delete survey
router.get('/delete/:id', function (req, res, next) {
    // get the id from the url
    var id = req.params.id;
    // use the model and delete this record
    Survey.remove({ _id: id }, function (error) {
        if (error) {
            console.log(error);
            res.end(error);
        }
        else {
            res.redirect('/survey');
        }
    });
});
// make this public
module.exports = router;

//# sourceMappingURL=survey.js.map
