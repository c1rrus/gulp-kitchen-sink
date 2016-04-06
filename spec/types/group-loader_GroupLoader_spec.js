/*
 Jasmine unit tests for GroupLoader class in types/group-loader.js
 */
(function(){
  "use strict";

  const fs = require('fs');
  const path = require('path');

  // Some useful values & types
  const DEFAULT_TASK_MODULES_DIR = path.join(__dirname, '../../lib/tasks/');
  const TEST_TASK_MODULES_DIR = path.join(__dirname, '../testdata/tasks/');
  const TASK_MODULE_REGEX = /^(\w+)\-tasks\.js$/;

  const BuildConfig = require('../../lib/types/build-config');
  const GulpTaskGroup = require('../../lib/types/task-group');
  const GroupLoader = require('../../lib/types/group-loader');

  const gulp = require('gulp');


  // Helpers

  // Find all files that have the form [module name]-tasks.js
  // and return the results as an object containing
  // [module name] : [file name] properties.
  function findTaskModules(dir){
    var modules = {};
    var matches;
    var files = fs.readdirSync(dir);
    for(var i=0; i<files.length; ++i){
      if((matches = files[i].match(TASK_MODULE_REGEX)) !== null){
        // Found a matching file name
        modules[matches[1]] = files[i];
      }
    }
    return modules;
  }

  // Wrap our spec group in a function, so that we can create
  // multiple variants of it
  function describeGroupLoader(description, inputModDir, expectedModDir){

    describe(description, function() {

      // Each test in this group gets a fresh GulpTaskGroup instance
      // so that it can manipulate its state
      beforeEach(function(){
        this.config = new BuildConfig();
        // Ensure that task group names come before action names
        // and do not have a prefix.
        // (This should be the default, but setting it explicitly
        // for future-proofing)
        this.config.tasks.groupBeforeAction = true;
        this.config.tasks.defaultPrefixName = false;
        this.loader = new GroupLoader(gulp, this.config, inputModDir);
      });

      afterEach(function(){
        // Delete the instances after each test
        delete this.loader;
        delete this.config;

        // Reset Gulp (this will remove any tasks
        // that might have been added by a test)
        gulp.reset();
      });


      // Tests

      it("initially has a gulp property, whose value matches what was passed to the constructor", function(){
        expect(this.loader.gulp).toBeDefined();
        expect(this.loader.gulp).toEqual(gulp);
      });

      it("initially has a config property, whose value matches what was passed to the constructor", function(){
        expect(this.loader.config).toBeDefined();
        expect(this.loader.config).toEqual(this.config);
      });

      it("initially has a modulesDir property, with the correct value", function(){
        expect(this.loader.modulesDir).toBeDefined();
        expect(this.loader.modulesDir).toEqual(expectedModDir);
      });


      it("finds all available task modules", function(){
        // Get the set of group names we expect the GroupLoader to find
        const expectedGroups = Object.keys(findTaskModules(expectedModDir));

        // Ask GroupLoader to find names of available task groups
        const availableGroups = this.loader.availableTaskGroups();
        // Check that the same number of groups were found
        expect(availableGroups.length).toEqual(expectedGroups.length);
        // Check that the same group names were found
        for(var i=0; i<expectedGroups.length; ++i){
          expect(availableGroups).toContain(expectedGroups[i]);
        }
      });

      it("finds available task modules without loading them", function(){
        // The before count of loaded modules
        const initialLoadedCount = this.loader.loadedTaskGroups().length;

        // Ask GroupLoader to find names of available task groups
        this.loader.availableTaskGroups();

        // Check that loaded count has not changed
        expect(this.loader.loadedTaskGroups().length).toEqual(initialLoadedCount);
      });

      it("can load a task group", function(){
        const availableGroups = this.loader.availableTaskGroups();
        if(availableGroups.length === 0){
          // Mark test as pending if there are no available task groups to load.
          pending("No available tasks groups in: " + this.loader.modulesDir);
        }
        else{
          // Load the 1st task group we found (we know there are more than zero
          // so there must be at least one!)
          const groupName = availableGroups[0];
          const tasks = this.loader.taskGroup(groupName);

          // Check that the loaded object is a GulpTaskGroup
          expect(tasks instanceof GulpTaskGroup).toBe(true);
          // Check that the task group has the same group name
          expect(tasks.groupName).toEqual(groupName);
          // Check that the loaded task group has the same group name we
          // used when loading it
          expect(this.loader.loadedTaskGroups()).toContain(groupName);
        }
      });

      it("can load all available task groups in one go", function(){
        const availableGroups = this.loader.availableTaskGroups();
        if(availableGroups.length === 0){
          // Mark test as pending if there are no available task groups to load.
          pending("No available tasks groups in: " + this.loader.modulesDir);
        }
        else{
          const taskGroups = this.loader.getAllAvailableTaskGroups();

          // Check that returned value is an array
          expect(taskGroups).toEqual(jasmine.any(Array));

          // Check all available groups were loaded
          expect(taskGroups.length).toEqual(availableGroups.length);

          // Per task-group checks
          var tasks;
          for(var i=0; i<taskGroups.length; ++i){
            tasks = taskGroups[i];

            // Check that the loaded object is a GulpTaskGroup
            expect(tasks instanceof GulpTaskGroup).toBe(true);
            // Check that the task group's name is amongst the
            // available groups
            expect(availableGroups).toContain(tasks.groupName);
          }
        }
      });


    });
  }


  // Create the test groups
  describeGroupLoader("A GroupLoader", undefined, DEFAULT_TASK_MODULES_DIR);
  describeGroupLoader("A GroupLoader with a custom module dir", TEST_TASK_MODULES_DIR, TEST_TASK_MODULES_DIR);

})();


