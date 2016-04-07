/*
 Jasmine unit tests that run on every tasks module to check that they
 each export a correct taskModuleFn signature.
 */
(function(){
  "use strict";

  const fs = require('fs');
  const path = require('path');

  // Some useful values & types
  const DEFAULT_TASK_MODULES_DIR = path.join(__dirname, '../../lib/tasks/');
  const TASK_MODULE_REGEX = /^(\w+)\-tasks\.js$/;

  const describeTasksModuleFn = require('../tasksModuleFn');

  const BuildConfig = require('../../lib/types/build-config');
  const GulpTaskGroup = require('../../lib/types/task-group');
  const GroupLoader = require('../../lib/types/group-loader');

  const gulp = require('gulp');


  // Find all modules that have the form [group name]-tasks.js
  // and create a test group for each to check that they
  // correctly export a tasksModuleFn
  var matches, fileName, groupName, tasksModuleFn;
  var files = fs.readdirSync(DEFAULT_TASK_MODULES_DIR);
  for(var i=0; i<files.length; ++i){
    if((matches = files[i].match(TASK_MODULE_REGEX)) !== null){
      // Found a matching file name
      fileName = files[i];

      // Load the module
      tasksModuleFn = require(path.join(DEFAULT_TASK_MODULES_DIR, fileName))

      // Create a test group to test the module's exported function
      describeTasksModuleFn('The '+fileName+' module', gulp, tasksModuleFn);
    }
  }

})();
