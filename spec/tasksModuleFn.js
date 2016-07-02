/*
 Exports a function that creates ae Jasmine unit test group for functions that should adhere to the
 tasksModuleFn signature.
 */
"use strict";

const GulpTaskGroup = require('../lib/types/task-group');
const BuildConfig = require('../lib/types/build-config');

const groupName = 'my-test-group';

// Export a global function
module.exports = function(description, gulp, tasksModuleFn, additionalTestsFn){

  describe(description, function(){

    beforeEach(function(){
      this.config = new BuildConfig();
      // Ensure that task group names come before action names
      // and do not have a prefix.
      // (This should be the default, but setting it explicitly
      // for future-proofing)
      this.config.tasks.groupBeforeAction = true;
      this.config.tasks.defaultPrefixName = false;
    });

    afterEach(function(){
      // Delete the instances after each test
      delete this.config;

      // Reset Gulp (this will remove any tasks
      // that might have been added by a test)
      gulp.reset();
    });


    // Tests

    it("is a function", function(){
      expect(typeof tasksModuleFn).toBe('function');
    });

    it("returns a GulpTaskGroup (with explicit name, config & lazyload)", function(){
      const tasks = tasksModuleFn(gulp, groupName, this.config, true);
      // Check that the correct type was returned
      expect(tasks instanceof GulpTaskGroup).toBe(true);

      // Check that name is the one we provided
      expect(tasks.groupName).toEqual(groupName);

      // Check that config is the one we provided
      expect(tasks.config).toEqual(this.config);

      // Check that no tasks have been added to Gulp
      const actions = tasks.getActions();
      for(var i=0; i<actions.length; ++i){
        expect(gulp.hasTask(tasks.taskName(actions[i]))).toBe(false);
      }
    });

    it("returns a GulpTaskGroup (with fallback name, but explicit config & lazyload)", function(){
      const tasks = tasksModuleFn(gulp, undefined, this.config, true);
      // Check that the correct type was returned
      expect(tasks instanceof GulpTaskGroup).toBe(true);

      // Check there is a group name and it is a string
      expect(tasks.groupName).toBeDefined();
      expect(tasks.groupName).toEqual(jasmine.any(String));

      // Check that config is the one we provided
      expect(tasks.config).toEqual(this.config);

      // Check that no tasks have been added to Gulp
      const actions = tasks.getActions();
      for(var i=0; i<actions.length; ++i){
        expect(gulp.hasTask(tasks.taskName(actions[i]))).toBe(false);
      }
    });

    it("returns a GulpTaskGroup (with fallback global config, but explicit name & lazyload)", function(){
      const tasks = tasksModuleFn(gulp, groupName, undefined, true);
      // Check that the correct type was returned
      expect(tasks instanceof GulpTaskGroup).toBe(true);

      // Check there is a group name and it is a string
      expect(tasks.groupName).toEqual(groupName);

      // Check that config is the one we provided
      const globalConfig = require('../lib/shared/config')
      expect(tasks.config).toEqual(globalConfig);

      // Check that no tasks have been added to Gulp
      const actions = tasks.getActions();
      for(var i=0; i<actions.length; ++i){
        expect(gulp.hasTask(tasks.taskName(actions[i]))).toBe(false);
      }
    });


    // Auto-loading tasks

    it("returns a GulpTaskGroup that auto-loads tasks (when is lazyload explicitly disabled)", function(){
      const tasks = tasksModuleFn(gulp, groupName, this.config, false);
      // Check that the correct type was returned
      expect(tasks instanceof GulpTaskGroup).toBe(true);

      // Check that no tasks have been added to Gulp
      const actions = tasks.getActions();
      for(var i=0; i<actions.length; ++i){
        expect(gulp.hasTask(tasks.taskName(actions[i]))).toBe(true);
      }
    });

    it("returns a GulpTaskGroup that auto-loads tasks (when is lazyload is omitted)", function(){
      const tasks = tasksModuleFn(gulp);
      // Check that the correct type was returned
      expect(tasks instanceof GulpTaskGroup).toBe(true);

      // Check that no tasks have been added to Gulp
      const actions = tasks.getActions();
      for(var i=0; i<actions.length; ++i){
        expect(gulp.hasTask(tasks.taskName(actions[i]))).toBe(true);
      }
    });


    if(additionalTestsFn){
      additionalTestsFn();
    }

  });

};
