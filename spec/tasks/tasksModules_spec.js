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

  const gulp = require('gulp');

  // Function to generate an additional test function that
  // captures the passed in values in its closure
  function getAdditionalTests(fileName, tasksModuleFn){
    return function(){
      // Additional tests

      it("can alternatively be loaded via gulp-load", function(){
        // Include gulp-load.
        // Note that this monkey-patches a loadTasks() method
        // on to our gulp instance!
        const loadTasks = require('gulp-load')(gulp);

        // First get the GulpTaskGroup via kitchen-sink's own loading
        // mechanism
        const tasks = tasksModuleFn(gulp, undefined, undefined, true);
        const actions = tasks.getActions();
        // Grab the task names that would get generated
        const taskNames = [];
        var i;
        for(i=0; i<actions.length; ++i){
          taskNames.push(tasks.taskName(actions[i]));
        }

        // Now try loading our tasks module via gulp-load's loadTasks()
        // directly
        const moduleFilePath = path.join(DEFAULT_TASK_MODULES_DIR, fileName);
        loadTasks(moduleFilePath);

        // Check that all the expected tasks are present
        for(i=0; i<taskNames.length; ++i){
          expect(gulp.hasTask(taskNames[i])).toBe(true);
        }

        // Undo gulp-load's monkey-patching
        delete gulp.loadTasks
      });

    };
  }


  // Find all modules that have the form [group name]-tasks.js
  // and create a test group for each to check that they
  // correctly export a tasksModuleFn
  var matches, fileName, tasksModuleFn;
  var files = fs.readdirSync(DEFAULT_TASK_MODULES_DIR);
  for(var i=0; i<files.length; ++i){
    if((matches = files[i].match(TASK_MODULE_REGEX)) !== null){
      // Found a matching file name
      fileName = files[i];

      // Load the module
      tasksModuleFn = require(path.join(DEFAULT_TASK_MODULES_DIR, fileName))

      // Create a test group to test the module's exported function
      describeTasksModuleFn('The '+fileName+' module', gulp, tasksModuleFn, getAdditionalTests(fileName, tasksModuleFn));
    }
  }

})();
