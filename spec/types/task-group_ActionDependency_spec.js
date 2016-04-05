/*
 Jasmine unit tests for the ActionDependency class in types/task-group.js
 */
describe("An ActionDependency", function() {
  "use strict";

  // Some useful values & types
  const GROUP_NAME = 'test-group';
  const ACTION_NAME = 'test-action';
  const SEP = ':'; // separator used in task names

  const BuildConfig = require('../../lib/types/build-config');
  const GulpTaskGroup = require('../../lib/types/task-group');
  const ActionDependency = GulpTaskGroup.ActionDependency;


  // Each test in this group gets a fresh ActionDependency instance
  // so that it can manipulate its state
  beforeEach(function(){
    this.config = new BuildConfig();
    // Ensure that task group names come before action names
    // and do not have a prefix.
    // (This should be the default, but setting it explicitly
    // for future-proofing)
    this.config.tasks.groupBeforeAction = true;
    this.config.tasks.defaultPrefixName = false;

    this.tasks = new GulpTaskGroup(GROUP_NAME, this.config);

    this.actionDep = new ActionDependency(GROUP_NAME, ACTION_NAME);
  });

  afterEach(function(){
    // Delete the instances after each test
    delete this.actionDep;
    delete this.tasks;
    delete this.config;
  });


  // Tests

  it("initially has groupName and actionName properties, whose values match what was passed to the constructor", function(){
    expect(this.actionDep.groupName).toBeDefined();
    expect(this.actionDep.groupName).toEqual(GROUP_NAME);

    expect(this.actionDep.actionName).toBeDefined();
    expect(this.actionDep.actionName).toEqual(ACTION_NAME);
  });


  it("can test if it belongs to a task group", function(){
    expect(this.actionDep.isExternalTo(this.tasks)).toBe(false);
  });

  it("can test if it does not belong to a task group", function(){
    // Create another task group
    const otherGroupName = 'other-group';
    const otherTasks = new GulpTaskGroup(otherGroupName, this.config);
    // Now test against it
    expect(this.actionDep.isExternalTo(otherTasks)).toBe(true);
  });


  it("creates task names correctly", function(){
    expect(this.actionDep.createTaskName(this.config)).toEqual(GROUP_NAME + SEP + ACTION_NAME);
  });

  it("creates task names correctly (with prefix)", function(){
    const prefixName = 'test-prefix';
    this.config.tasks.defaultPrefixName = prefixName;
    expect(this.actionDep.createTaskName(this.config)).toEqual(prefixName + SEP + GROUP_NAME + SEP + ACTION_NAME);
  });

  it("creates task names correctly (with action before group)", function(){
    this.config.tasks.groupBeforeAction = false;
    expect(this.actionDep.createTaskName(this.config)).toEqual(ACTION_NAME + SEP + GROUP_NAME);
  });

  it("creates task names correctly (with prefix and action before group)", function(){
    const prefixName = 'test-prefix';
    this.config.tasks.defaultPrefixName = prefixName;
    this.config.tasks.groupBeforeAction = false;
    expect(this.actionDep.createTaskName(this.config)).toEqual(prefixName + SEP + ACTION_NAME + SEP + GROUP_NAME);
  });

});
