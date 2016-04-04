/**
 * Module that exports a number of functions that can generate lazypipes
 * for performing various LESS-related tasks.
 *
 * @file
 */
"use strict";

const lazypipe = require('lazypipe');
const less = require('gulp-less');
const lessHint = require('gulp-lesshint');
const filter = require('gulp-filter');
const debug = require('gulp-debug');



// Returns a function that takes a vinyl file object as
// an argument and always returns true.
// The file object is also passed to conditionFn. If conditionFn
// returns true, callbackFn is called (and also passed the
// file object as its argument).
function createFilterCallbackFn(conditionFn, callbackFn){
  return function (file) {
    if (conditionFn(file)) {
      callbackFn(file);
    }
    return true; // Do not actually filter any files
  };
}

const HINT_SEVERITY_WARNING = 'warning';
const HINT_SEVERITY_ERROR = 'error';

// Returns a function that checks a vinyl file for the presence
// of a LESS hinter result with the given severity.
function createHintSeverityCheckFn(severity){
  return function(file) {
    var foundIssue = false;
    if( file.lesshint.resultCount > 0 ){
      var results = file.lesshint.results;
      for(var i=0; i<results.length; ++i){
        if(results[i].severity === severity){
          foundIssue = true;
          break;
        }
      }
    }
    return foundIssue;
  };
}

// Returns a function that always returns true.
// However, it also checks if a vinyl file object has a
// LESS hinter result with the given severity and, if so,
// calls the provided callback function.
function createHintSeverityCallbackFn(severity, callback){
  return createFilterCallbackFn(
    createHintSeverityCheckFn(severity),
    callback
  );
}


/**
 * @module gulp-kitchen-sink/lazypipes/less-pipes
 *
 */
module.exports = {

  createHintPipe: function(lessHintOptions, errorCallback, warningCallback){
    var hintPipe = lazypipe()
      .pipe(debug, {title: 'less hint pipe'})
      .pipe(lessHint, lessHintOptions)
    //.pipe(lessHint.reporter);

    // Add in error callbacks if needed
    if(errorCallback){
      hintPipe = hintPipe.pipe(filter, createHintSeverityCallbackFn(HINT_SEVERITY_ERROR, errorCallback));
    }

    // Add in warning callbacks if needed
    if(warningCallback){
      hintPipe = hintPipe.pipe(filter, createHintSeverityCallbackFn(HINT_SEVERITY_WARNING, warningCallback));
    }

    return hintPipe;
  },

  createBuildPipe: function(lessOptions){
    return lazypipe()
      .pipe(debug, {title: 'less build pipe'})
      .pipe(less, lessOptions);
  }

};



