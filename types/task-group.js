/**
 * Module that exports a class for defining groups of reusable Gulp
 * tasks.
 *
 * @see module:gulp-kitchen-sink/types/task-group
 *
 * @file
 */
"use strict";

// DOCUMENTATION STUFF
/**
 * Gulp.
 * @external gulp
 * @see {@link https://github.com/gulpjs/gulp/blob/master/docs/API.md|Gulp API docs}
 */

/**
 * Performs the Gulp task's main operations.
 *
 * Refer to {@link https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulptaskname--deps-fn|Gulp's API documentation}
 * for the expected behaviours.
 *
 * @callback gulpTaskFn
 *
 * @param {function} [cb]  Callback function to indicate when the task has completed.
 * @returns {void|Stream|Promise} Returns nothing if the function accepted a callback or runs synchronously.
 *                                Otherwise it must return a Node Stream or a Promise.
 *
 * @see {@link https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulptaskname--deps-fn|Gulp's API documentation}
 */

/**
 * Returns a task group and adds all of that group's actions to Gulp's tasks.
 *
 * All of the `gulp-kitchen-sink/tasks/*` modules are expected to export a function matching this
 * signature. This makes them compatible with [`gulp-load`](https://www.npmjs.com/package/gulp-load),
 * in case users wish to use that over `gulp-kitchen-sink`'s own mechanisms. This is because, if only
 * a Gulp instance is provided as the first argument, this function will automatically add tasks to
 * Gulp (which is what `gulp-load` expects).
 *
 * For cases where the auto-loading of tasks is not desired (e.g. if specific actions from the group
 * need to be added individually), the 2nd `lazyload` parameter should be set to `true`.
 *
 * @typedef {function} tasksModuleFn
 *
 * @param {external:gulp} gulp    The gulp instance that the tasks will be added to.
 * @param {boolean} [lazyload]    If omitted or `false`, all tasks within the task group will immediately be
 *                                added to Gulp (this is the default behaviour).
 *                                If `true`, tasks will **not** be added to Gulp.
 * @param {module:gulp-kitchen-sink/types/build-config} [config]
 *                                The build config that will be passed to the task group when it is created.
 *                                If none is provided, the global config object should be used.
 *
 * @see module:gulp-kitchen-sink/types/task-group#createTasksModule
 */

/**
 * Adds actions to the task group.
 *
 *
 *
 *
 * @callback addActionsFn
 *
 * @param {module:gulp-kitchen-sink/types/task-group} tasks
 *                The task group that actions should be added to.
 *
 * @param {external:gulp} gulp
 *                The gulp instance that the task group will ultimately
 *                add its actions to.
 *
 * @see module:gulp-kitchen-sink/types/task-group.createTasksModule
 */

/**
 * Either a string or an {@link module:gulp-kitchen-sink/types/task-group.ActionDependency|ActionDependency object}.
 *
 * @typedef {string|module:gulp-kitchen-sink/types/task-group.ActionDependency} module:gulp-kitchen-sink/types/task-group~stringOrActionDep
 */

// END DOCUMENTATION STUFF




/**
 * Constructs an action dependency.
 *
 * Dependencies on other actions in the same group can just be specified by
 * their action names. However, for dependencies on an actions in other groups,
 * instances of this class must be used.
 *
 * @param {string} groupName      The name of the other group that contains the action
 *                                we are dependent on.
 * @param {string} actionName     The action name within that group.
 *
 * @constructor
 *
 * @alias module:gulp-kitchen-sink/types/task-group.ActionDependency
 */
function ActionDependency(groupName, actionName){

  /**
   * This action dependency's group name.
   *
   * @member {string}
   */
  this.groupName = groupName;

  /**
   * This action dependency's action name.
   *
   * @member {string}
   */
  this.actionName = actionName;
}

/**
 * Checks if this action dependency refers to a task that is from
 * a different task group to the one provided.
 *
 * @param {module:gulp-kitchen-sink/types/task-group} gulpTaskGroup
 *                                        The task group to test against.
 * @returns {boolean}                     True if this action dependency is from a
 *                                        a different task group. False if it is
 *                                        from `gulpTaskGroup`.
 */
ActionDependency.prototype.isExternalTo = function(gulpTaskGroup){
  return this.groupName && this.groupName !== gulpTaskGroup.groupName;
};

/**
 * Returns the complete Gulp task name for this task dependency.
 *
 * The task name will use the provided
 * {@link module:gulp-kitchen-sink/types/task-group#config|task group's config object} to
 * determine the order of group and action names as well as any optional
 * namespace prefix.
 *
 * @param {module:gulp-kitchen-sink/types/task-group} gulpTaskGroup
 *                                        The task group that this dependency is
 *                                        external to.
 *
 * @returns {string}  The complete task name.
 */
ActionDependency.prototype.createTaskName = function(gulpTaskGroup){
  if( this.isExternalTo(gulpTaskGroup) ){
    return gulpTaskGroup.config.createTaskName(this.groupName, this.actionName);
  }
  else{
    return gulpTaskGroup.createTaskName(this.actionName);
  }
};




/**
 * This module exports a Gulp task group constructor.
 *
 * A task group is a logical grouping of Gulp tasks generators. Typically,
 * tasks that operate on the same kind of files (e.g. SASS files) will be
 * together in the same group. The different tasks within a group (e.g.
 * watching, linting, compiling, etc.) are known as _actions_.
 *
 * Groups and actions have names. For example, there might be a group called
 * 'sass' which contains actions like 'lint', 'build', etc. These are combined
 * to create the Gulp task names. By default `[groupName]:[actionName]` is used
 * (e.g. `sass:build`), but the order can be reversed by setting the global
 * config object's `tasks.groupBeforeAction` flag to `false`.
 *
 * To avoid name clashes with other Gulp tasks that users may have defined, an
 * optional namespace prefix can be added via the global config object's
 * `tasks.defaultPrefixName` property. Then task names will become:
 * `[prefixName]:[groupName]:[taskName]` (e.g. `foo:sass:build`).
 *
 * Initially, the task group will not contain any actions. These
 * need to be added via the {@link module:gulp-kitchen-sink/types/task-group#addAction|addAction()} method.
 *
 * @param {string} groupName    The name of this group.
 *                              This name will be used for generating task names.
 *
 * @param {module:gulp-kitchen-sink/types/build-config} config
 *                    A reference to the config object to use.
 *                    This should normally be a reference to the global config
 *                    object.
 * @constructor
 *
 * @exports gulp-kitchen-sink/types/task-group
 */
function GulpTaskGroup(groupName, config){

  /**
   * This task group's name.
   *
   * @member {string}
   */
  this.groupName = groupName;

  /**
   * This task group's config object.
   *
   * @member {module:gulp-kitchen-sink/types/build-config}
   */
  this.config = config;

  /**
   * The task loader functions for this group's actions.
   *
   * This takes the form of an object whose keys are the action names
   * and whose corresponding values are
   * {@link module:gulp-kitchen-sink/types/task-group~taskLoaderFn|task loader functions}.
   *
   * @member {Object}
   *
   * @private
   */
  this._taskLoaders = {};
}

/**
 * Returns an array of the names of this task group's actions.
 *
 * @returns {string[]}  This group's action names.
 */
GulpTaskGroup.prototype.listActionNames = function(){
  return Object.keys(this._taskLoaders);
};

/**
 * Returns an action dependency object for the given
 * action name.
 *
 * This helper function is useful for other task groups
 * whose actions have dependencies on actions within this
 * group.
 *
 * @param {string} actionName   The name of an action in this
 *                              group.
 * @returns {module:gulp-kitchen-sink/types/task-group.ActionDependency}
 *                              An action dependency object
 *                              for the specified action in
 *                              this group.
 */
GulpTaskGroup.prototype.getActionDep = function(actionName){
  return new ActionDependency(this.groupName, actionName);
};

/**
 * Returns a complete Gulp task name from an action name.
 *
 * The task name will use this group's name and combine it
 * with the given action name, using this group's config object
 * to determine the order of group and action names as well as
 * any optional namespace prefix.
 *
 * @param {string} actionName     The name of an action in this group.
 * @return {string}               The task name.
 */
GulpTaskGroup.prototype.createTaskName = function(actionName){
  return this.config.createTaskName(this.groupName, actionName);
};

/**
 * Converts an array of action names and/or action dependency
 * objects into an array of the corresponding Gulp task names.
 *
 * The task names will be creating using this group's
 * {@link module:gulp-kitchen-sink/types/task-group#config|config object}
 * for determining the order of group and action names as well as
 * any optional namespace prefix.
 *
 * @param {module:gulp-kitchen-sink/types/task-group~stringOrActionDep[]} deps
 *                          The action dependencies to resolve to task names.
 * @returns {string[]}      The resolved Gulp task names.
 */
GulpTaskGroup.prototype.resolveDepNames = function(deps){
  var i, dep;
  var resolvedDeps = [];
  for(i=0; i<deps.length; ++i){
    dep = deps[i];
    if(dep instanceof ActionDependency){
      resolvedDeps.push(dep.createTaskName(this));
    }
    else{
      // assume string action name from this group
      resolvedDeps.push(this.createTaskName(dep));
    }
  }
  return resolvedDeps;
};

/**
 * Adds an action to this task group.
 *
 * The signature of this function is deliberately similar to `gulp.task()`,
 * except that action names are used instead of task names.
 *
 * Actions are in effect potential Gulp tasks where the task names
 * and names of any task dependencies are not yet known. By calling
 * {@link module:gulp-kitchen-sink/types/task-group#loadTask|loadTask()}
 * or {@link module:gulp-kitchen-sink/types/task-group#loadAllTasks|loadAllTasks()},
 * you can add actions to Gulp as tasks. At that point, the action names are
 * resolved to the corresponding task names, as per this group's config object.
 *
 * If this group already contains an action with the same action name,
 * then that action will be overwritten by the new one.
 *
 * @param {string} actionName     The name of the action being added. (e.g.
 *                                'build', 'clean', 'lint')
 * @param {module:gulp-kitchen-sink/types/task-group~stringOrActionDep[]} [deps]
 *                      Other actions that this action depends on. These will later
 *                      be resolved to the corresponding Gulp task names.
 * @param {gulpTaskFn} fn
 *                      The function that performs the Gulp task's main
 *                      operations. This is exactly the same function
 *                      that you'd pass to gulp.task(), if you were
 *                      using Gulp directly.
 */
GulpTaskGroup.prototype.addAction = function(){
  var actionName = arguments[0];
  var actionDeps, taskFn;
  if(arguments.length == 2){
    actionDeps = [];
    taskFn = arguments[1];
  }
  else{
    // assume 3rd argument
    actionDeps = arguments[1];
    taskFn = arguments[2];
  }

  this._taskLoaders[actionName] = this._createTaskLoaderFn(actionName, actionDeps, taskFn);
};

/**
 * Creates a function that resolves an action's name and dependencies to the
 * corresponding task names and adds it to Gulp's tasks.
 *
 * This is how actions are stored internally. Then, when
 * {@link module:gulp-kitchen-sink/types/task-group#loadTask|loadTask()}
 * or {@link module:gulp-kitchen-sink/types/task-group#loadAllTasks|loadAllTasks()}
 * are called, these functions are executed to add the actions
 * to Gulp's tasks at that time.
 *
 * This means that the resolution of action names to task names is deferred until
 * the very last moment. That is important since it is what allows reusable tasks
 * whose names can be configured at run time to be defined.
 *
 * @param {string}  actionName    The name of this action.
 * @param {module:gulp-kitchen-sink/types/task-group~stringOrActionDep[]} actionDeps
 *                                Other actions that this action depends on.
 * @param {gulpTaskFn} taskFn     The function that performs the Gulp task's main
 *                                operations.
 * @returns {module:gulp-kitchen-sink/types/task-group~taskLoaderFn}
 *                                            The completed task loading function for
 *                                            this action.
 *
 * @private
 */
GulpTaskGroup.prototype._createTaskLoaderFn = function(actionName, actionDeps, taskFn){

  /**
   * Loads an action and adds it as a task to Gulp via `gulp.task(...)`.
   *
   * The task's name (and the names of its dependencies) are generated when this function
   * executes from the task group's name, the action name and the settings in the group's
   * config object.
   *
   * @typedef {function} module:gulp-kitchen-sink/types/task-group~taskLoaderFn
   *
   * @param {external:gulp} gulp    The Gulp instance the task should be added to when
   *                                it is loaded.
   *
   * @private
   */
  return function(gulp){
    var taskName = this.createTaskName(actionName);
    if(actionDeps && actionDeps.length > 0){
      // Resolve dep names
      var taskDeps = this.resolveDepNames(actionDeps);
      // Add task to Gulp
      gulp.task(
        taskName,
        taskDeps,
        taskFn
      );
    }
    else{
      // No deps. Add task to Gulp directly.
      gulp.task(
        taskName,
        taskFn
      );
    }
  }.bind(this);
};

/**
 * Loads the specified action and adds it to Gulp's tasks.
 *
 * The action's name (and also the names of any other actions
 * it depends on) will be converted to the corresponding Gulp
 * task names as per the settings in this group's config object.
 *
 * @param {string} actionName     The name of the action from this group that
 *                                should be added as a task.
 * @param {external:gulp} gulp
 *                      The Gulp instance that the task will be
 *                      added to.
 */
GulpTaskGroup.prototype.loadTask = function(actionName, gulp){
  this._taskLoaders[actionName](gulp);
};

/**
 * Loads all actions in this group and adds them to Gulp's tasks.
 *
 * The actions' names (and also the names of any other actions
 * they depend on) will be converted to the corresponding Gulp
 * task names as per the settings in this group's config object.
 *
 * @param {external:gulp} gulp
 *                      The Gulp instance that the tasks will be
 *                      added to.
 */
GulpTaskGroup.prototype.loadAllTasks = function(gulp){
  var actionName;
  for(actionName in this._taskLoaders){
    this.loadTask(actionName, gulp);
  }
};

// ##### STATIC methods

/**
 * Factory function that creates a function suitable for us as
 * a tasks module export.
 *
 * The returned function will create a new task group and return
 * it. By default, all actions in the newly created group will be
 * added to Gulp's tasks before the group is returned. However
 * this can be disabled.
 *
 *
 * @param {string} groupName              The name for the new task group.
 * @param {addActionsFn} addActionsFn     A callback function that is called after the
 *                                        new task group has been created. Can be used
 *                                        to add actions to the group.
 * @returns {tasksModuleFn}    The completed factory function.
 */
GulpTaskGroup.createTasksModule = function(groupName, addActionsFn){
  return function(gulp, lazyLoad, config){
    // If no config was given, load the global one
    if(!config){
      config = require('../shared/config');
    }

    // Create a new task group
    const tasks = new GulpTaskGroup(groupName, config);

    // If a function for adding tasks was provided, run it
    if(addActionsFn){
      addActionsFn(tasks, gulp);
    }

    // Unless the lazyload flag was set, immediately
    // create all the Gulp tasks.
    // This is for compatibility with the 'gulp-load'
    // plug-in.
    if(!lazyload){
      tasks.loadAllTasks(gulp);
    }

    return tasks;
  };
};


module.exports = GulpTaskGroup;
module.exports.ActionDependency = ActionDependency;
