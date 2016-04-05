/*
 Jasmine unit tests for the GulpTaskGroup class in types/task-group.js
 */
describe("A GulpTaskGroup", function(){

  // Some useful values & types
  const GROUP_NAME = 'test-group';
  const ACTION_NAME = 'test-action';
  const SEP = ':'; // separator used in task names

  const BuildConfig = require('../../lib/types/build-config');
  const GulpTaskGroup = require('../../lib/types/task-group');

  const gulp = require('gulp');

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
    this.tasks = new GulpTaskGroup(GROUP_NAME, this.config);
  });

  afterEach(function(){
    // Delete the instances after each test
    delete this.tasks;
    delete this.config;

    // Reset Gulp (this will remove any tasks
    // that might have been added by a test)
    gulp.reset();
  });


  // Tests

  it("initially has a groupName property, whose value matches what was passed to the constructor", function(){
    expect(this.tasks.groupName).toBeDefined();
    expect(this.tasks.groupName).toEqual(GROUP_NAME);
  });


  it("initially has a config property, whose value matches what was passed to the constructor", function(){
    expect(this.tasks.config).toBeDefined();
    // Note that this checks that this property is a reference to the same config object
    // instance. (So it would fail if it was a different instance, even if it contained the
    // exact same values)
    // This is intentional, since config objects are meant to be shared.
    expect(this.tasks.config).toEqual(this.config);
  });


  it("initially has no actions within it", function(){
    const actionNames = this.tasks.getActions();
    // First check that the returned type is correct
    expect(actionNames).toEqual(jasmine.any(Array));
    // Now check that the returned array is empty
    expect(actionNames.length).toEqual(0);
  });


  it("creates task names correctly", function(){
    expect(this.tasks.taskName(ACTION_NAME)).toEqual(GROUP_NAME + SEP + ACTION_NAME);
  });

  it("creates task names correctly (with prefix)", function(){
    const prefixName = 'test-prefix';
    this.config.tasks.defaultPrefixName = prefixName;
    expect(this.tasks.taskName(ACTION_NAME)).toEqual(prefixName + SEP + GROUP_NAME + SEP + ACTION_NAME);
  });

  it("creates task names correctly (with action before group)", function(){
    this.config.tasks.groupBeforeAction = false;
    expect(this.tasks.taskName(ACTION_NAME)).toEqual(ACTION_NAME + SEP + GROUP_NAME);
  });

  it("creates task names correctly (with prefix and action before group)", function(){
    const prefixName = 'test-prefix';
    this.config.tasks.defaultPrefixName = prefixName;
    this.config.tasks.groupBeforeAction = false;
    expect(this.tasks.taskName(ACTION_NAME)).toEqual(prefixName + SEP + ACTION_NAME + SEP + GROUP_NAME);
  });


  it("creates action dependencies correctly", function(){
    const actionDep = this.tasks.actionDep(ACTION_NAME);
    // Check that returned object is of correct type
    expect(actionDep instanceof GulpTaskGroup.ActionDependency).toBe(true);
    // Check that action dep properties were set correctly
    expect(actionDep.groupName).toEqual(GROUP_NAME);
    expect(actionDep.actionName).toEqual(ACTION_NAME);
  });


  it("resolves dependency names correctly", function(){
    const externalGroupName = 'other-group';
    const externalActionName = 'ext-action';
    const externalDep = new GulpTaskGroup.ActionDependency(externalGroupName, externalActionName);
    const inputDeps = [externalDep, ACTION_NAME];

    const resolvedDeps = this.tasks.resolveDeps(inputDeps);

    // Check that result is an array
    expect(resolvedDeps).toEqual(jasmine.any(Array));
    // Check that number of deps is the same
    expect(resolvedDeps.length).toEqual(inputDeps.length);
    // Check that the local action dep was resolved correctly
    expect(resolvedDeps).toContain(GROUP_NAME + SEP + ACTION_NAME);
    // Check that the external dep was resolved correctly
    expect(resolvedDeps).toContain(externalGroupName + SEP + externalActionName);
  });


  it("can have a simple action added to it", function(){
    const initialActionCount = this.tasks.getActions().length;

    // Add an action (just use a noop function, since we have
    // no intention of using it)
    this.tasks.addAction(ACTION_NAME, function(){});

    // Now fetch the action names
    const tasksAfterAdding = this.tasks.getActions();
    // Should have one more than before
    expect(tasksAfterAdding.length).toEqual(initialActionCount + 1);
    // List of action names should include the one we just added
    expect(tasksAfterAdding).toContain(ACTION_NAME);
  });


  it("can have an action with dependencies added to it", function(){
    const otherActionName = 'other-action';
    const externalGroupName = 'other-group';
    const externalActionName = 'ext-action';
    const externalDep = new GulpTaskGroup.ActionDependency(externalGroupName, externalActionName);
    const inputDeps = [externalDep, otherActionName];

    const initialActionCount = this.tasks.getActions().length;

    // Add an action (just use a noop function, since we have
    // no intention of using it)
    this.tasks.addAction(ACTION_NAME, inputDeps, function(){});

    // Now fetch the action names
    const tasksAfterAdding = this.tasks.getActions();
    // Should have one more than before
    expect(tasksAfterAdding.length).toEqual(initialActionCount + 1);
    // List of action names should include the one we just added
    expect(tasksAfterAdding).toContain(ACTION_NAME);
  });


  it("can add simple a task to Gulp", function(done){
    // Add an action whose function sets a flag
    // (so that we can verify that it actually ran)
    var taskRanFlag = false;
    this.tasks.addAction(ACTION_NAME, function(){
      taskRanFlag = true;
    });

    // Add the action to Gulp as a task
    this.tasks.loadTask(ACTION_NAME, gulp);
    const taskName = this.tasks.taskName(ACTION_NAME);

    // Check that the task was added to Gulp
    expect(gulp.hasTask(taskName)).toEqual(true);

    // Run the Gulp task
    gulp.start(function(err){
      if(err){
        done.fail('Task run failed: ', err);
      }

      // Verify that our task function ran
      expect(taskRanFlag).toBe(true);

      // Signal that the test has now completed
      done();
    });
  });


  it("can add a task with dependencies to Gulp", function(done){
    const otherActionName = 'other-action';
    const externalGroupName = 'other-group';
    const externalActionName = 'ext-action';
    const externalDep = new GulpTaskGroup.ActionDependency(externalGroupName, externalActionName);
    const inputDeps = [externalDep, otherActionName];

    // Need to add the external task and action that we depend on, otherwise
    // the Gulp run will fail
    gulp.task( (externalGroupName + SEP + externalActionName), function(){});
    this.tasks.addAction(otherActionName, function(){});
    this.tasks.loadTask(otherActionName, gulp);

    // Add an action whose function sets a flag
    // (so that we can verify that it actually ran)
    var taskRanFlag = false;
    this.tasks.addAction(ACTION_NAME, inputDeps, function(){
      taskRanFlag = true;
    });

    // Add the action to Gulp as a task
    this.tasks.loadTask(ACTION_NAME, gulp);
    const taskName = this.tasks.taskName(ACTION_NAME);

    // Check that the task was added to Gulp
    expect(gulp.hasTask(taskName)).toEqual(true);

    // Run the Gulp task
    gulp.start(function(err){
      if(err){
        done.fail('Task run failed: ' + err);
      }

      // Verify that our task function ran
      expect(taskRanFlag).toBe(true);

      // Signal that the test has now completed
      done();
    });
  });


  it("can add multiple tasks to Gulp at once", function(done){
    const taskCount = 5; // How many tasks to generate
    var tasksRan = 0;

    var i;
    for(i=0; i<taskCount; ++i){
      // generate unique action/task names by appending the
      // loop counter to the action name
      this.tasks.addAction(ACTION_NAME+"_"+i, function(cb){
        ++tasksRan; // Increment this counter, so we can check it later
        cb(); // Allow Gulp to run this task asynchronously
      });
    }

    // This should load all the tasks
    this.tasks.loadAllTasks(gulp);

    // Verify that they were all added
    const actionNames = this.tasks.getActions();
    var taskName;
    for(i=0; i<actionNames.length; ++i) {
      taskName = this.tasks.taskName(actionNames[i]);
      // Check that this task was added to Gulp
      expect(gulp.hasTask(taskName)).toEqual(true);
    }

    // Run the Gulp tasks
    gulp.start(function(err){
      if(err){
        done.fail('Task run failed: ' + err);
      }

      // Verify all of our tasks ran
      // (since each task incremented taskCount by 1)
      expect(tasksRan).toEqual(taskCount);

      // Signal that the test has now completed
      done();
    });
  });


});
