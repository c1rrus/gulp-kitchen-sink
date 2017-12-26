/*
 Jasmine unit tests for the createTasksModule() static function in types/task-group.js
 */
describe("GulpTaskGroup.createTasksModule()", function() {
  "use strict";

  const gulp = require('gulp');
  const describeTasksModuleFn = require('../tasksModuleFn');
  const GulpTaskGroup = require('../../lib/types/task-group');

  const fallbackGroupName = 'test-group-fallback';
  const groupName = 'test-group-explicit';
  const actionName = 'test-action';

  // addActionFn that adds one task
  function addActions(tasks, gulp){
    tasks.addAction(actionName, function(){});
  }


  // Tests

  it("is a function", function(){
    expect(typeof GulpTaskGroup.createTasksModule).toBe('function');
  });

  describeTasksModuleFn(
    "returns a taskModuleFn, that",
    gulp,
    GulpTaskGroup.createTasksModule(fallbackGroupName, addActions)
  );

  it("produces task groups with the correct name and actions", function(){
    // Create the task module function
    const taskModuleFn = GulpTaskGroup.createTasksModule(fallbackGroupName, addActions);
    // Use it to create a task group (don't care about config, so letting it fallback to global one)
    const tasks = taskModuleFn(gulp, groupName, undefined, true);

    expect(tasks.groupName).toEqual(groupName);
    expect(tasks.getActions().length).toEqual(1);
    expect(tasks.getActions()[0]).toEqual(actionName);
  });

  it("produces task groups with the fallback name and actions", function(){
    // Create the task module function
    const taskModuleFn = GulpTaskGroup.createTasksModule(fallbackGroupName, addActions);
    // Use it to create a task group (don't care about config, so letting it fallback to global one)
    const tasks = taskModuleFn(gulp, undefined, undefined, true);

    expect(tasks.groupName).toEqual(fallbackGroupName);
    expect(tasks.getActions().length).toEqual(1);
    expect(tasks.getActions()[0]).toEqual(actionName);
  });


});