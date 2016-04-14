"use strict";
var mongoose = require('mongoose');
var surveySchema = new mongoose.Schema({
    surveyTitle: {
        type: String,
        default: '',
        trim: true,
        required: 'Survey Title is required'
    },
    surveyType: {
        type: String,
        default: '',
        trim: true,
        required: 'Content is required'
    },
    lifeTime: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: true
    },
    Ques1: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your Question.'
    },
    Ques1Opt1: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your option.'
    },
    Ques1Opt2: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your option.'
    },
    Ques1Opt3: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your option.'
    },
    Ques1Opt4: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your option.'
    },
    Ques2: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your Question.'
    },
    Ques2Opt1: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your option.'
    },
    Ques2Opt2: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your option.'
    },
    Ques2Opt3: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your option.'
    },
    Ques2Opt4: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your option.'
    },
    Ques3: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your Question.'
    },
    Ques3Opt1: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your option.'
    },
    Ques3Opt2: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your option.'
    },
    Ques3Opt3: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your option.'
    },
    Ques3Opt4: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your option.'
    },
    Ques4: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your Question.'
    },
    Ques4Opt1: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your option.'
    },
    Ques4Opt2: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your option.'
    },
    Ques4Opt3: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your option.'
    },
    Ques4Opt4: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your option.'
    },
    Ques5: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your Question.'
    },
    Ques5Opt1: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your option.'
    },
    Ques5Opt2: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your option.'
    },
    Ques5Opt3: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your option.'
    },
    Ques5Opt4: {
        type: String,
        default: '',
        trim: true,
        required: 'Please enter your option.'
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    },
    idName: {
        type: String,
        default: '',
        trim: true,
        required: 'Display name is required'
    }
}, { collection: 'surveyInfo' });
exports.Survey = mongoose.model('Survey', surveySchema);

//# sourceMappingURL=survey.js.map
