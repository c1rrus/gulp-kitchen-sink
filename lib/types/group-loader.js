/**
 * Module that exports a class that can find and load task group modules.
 *
 * @file
 */
"use strict";

const fs = require('fs');
const path = require('path');

/**
 * The default task group modules directory.
 *
 * @type {string}
 * @inner
 * @private
 * @memberof module:gulp-kitchen-sink/types/group-loader
 */
const TASK_MODULES_DIR = path.join(__dirname, '../tasks/');

/**
 * A regex patterns that matches valid task group module
 * filenames.
 *
 * These should be in the form: `[groupName]-tasks.js`.
 *
 * On successful matches, the group name portion of the will
 * be in the 1st capture group.
 *
 * @type {Regex}
 * @inner
 * @private
 * @memberof module:gulp-kitchen-sink/types/group-loader
 */
const TASK_MODULE_REGEX = /^(\w+)\-tasks\.js$/;

/**
 * This module exports a task group loader constructor.
 *
 * Group loaders allow you to discover and selectively load
 * {@link module:gulp-kitchen-sink/types/task-group|task groups}.
 *
 * By default, a new task loader will look inside `gulp-kitchen-sink`'s
 * own `tasks/` directory to find available task group modules. However,
 * you can override this to point to different directory.
 *
 * Task group modules *must* adhere to the following rules in order to
 * work with a task loader:
 *
 * * Have a filename in the form: `[groupName]-tasks.js`.
 * * Export a {@link tasksModuleFn|task module function}.
 *
 * The group loader will lazily load task groups when you use its
 * {@link module:gulp-kitchen-sink/types/group-loader#getTaskGroup|getTaskGroup()}
 * method. This is to prevent unnecessarily loading task group modules,
 * which may themselves load a number of dependencies, such as Gulp plug-ins.
 *
 *
 * @param {external:gulp} gulp
 *              The Gulp instance that any task groups will be passed when
 *              they are loaded.
 * @param {module:gulp-kitchen-sink/types/build-config} config
 *              The build configuration that will be passed to task groups.
 * @param {string} [modulesDir]
 *              A directory containing task group modules. Defaults to
 *              the `gulp-kitchen-sink` package's own `tasks/` folder if
 *              omitted.
 *
 * @constructor
 * @exports gulp-kitchen-sink/types/group-loader
 */
function GroupLoader(gulp, config, modulesDir){
  this.gulp = gulp;
  this.config = config;
  this.modulesDir = modulesDir || TASK_MODULES_DIR;
  this._taskGroups = {};
}

/**
 * Returns the module name for a given task group name.
 *
 * This method takes the loader's module directory, and appends
 * `[groupName]-tasks` to make the full module name that
 * can then be used with Node's `require()` function.
 *
 * @param groupName   The name of the task group whose module name
 *                    should be returned.
 * @returns {string}  The task group's module name.
 *
 * @private
 */
GroupLoader.prototype._getModuleName = function(groupName){
  return this.modulesDir + groupName + '-tasks';
};

/**
 * Returns a task group, loading it from its module if required.
 *
 * The first time a task group is requested, its module will be loaded.
 * A reference to that task group will be cached internally, so that
 * subsequent requests to the same group will simply return the cached
 * reference.
 *
 * @param {string} groupName  The name of the task group to load.
 *
 * @returns {module:gulp-kitchen-sink/types/task-group}  The requested task group object.
 */
GroupLoader.prototype.getTaskGroup = function(groupName){
  var taskGroup = this._taskGroups[groupName];
  if(!taskGroup){
    taskGroup = this._taskGroups[groupName] = require(this._getModuleName(groupName))(this.gulp, true, this.config);
  }
  return taskGroup;
};

/**
 * Returns the names of all task groups that have been loaded.
 *
 * @returns {string[]}    The group names of the loaded task groups.
 */
GroupLoader.prototype.loadedTaskGroups = function(){
  return Object.keys(this._taskGroups);
};

/**
 * Lists the names of all available task group modules.
 *
 * This method will scan the task module directory for JS files
 * whose names are in the form: `[groupName]-tasks.js` and
 * return their `groupName` portions.
 *
 * This function will *not* attempt to load any of the modules.
 * To do that you must use
 * {@link module:gulp-kitchen-sink/types/group-loader#getTaskGroup|getTaskGroup()}
 * or
 * {@link module:gulp-kitchen-sink/types/group-loader#getAllAvailableTaskGroups|getAllAvailableTaskGroups()}.
 *
 *
 * @returns {string[]}  The names of all available task group modules.
 */
GroupLoader.prototype.availableTaskGroups = function(){
  var groupNames = [];
  var dirs = fs.readdirSync(this.modulesDir);
  var file, matches;
  for(var i=0; i<dirs.length; ++i){
    file = dirs[i];
    if( (matches = file.match(TASK_MODULE_REGEX)) !== null ){
      groupNames.push(matches[1]); // 1st matching group is task group name
    }
  }
  return groupNames;
};


/**
 * Returns a all available task groups, loading them from their modules if
 * required.
 *
 * The first time a task group is requested, its module will be loaded.
 * A reference to that task group will be cached internally, so that
 * subsequent requests to the same group will simply return the cached
 * reference.
 *
 * @returns {module:gulp-kitchen-sink/types/task-group[]}
 *                          All the available task group objects.
 *
 */
GroupLoader.prototype.getAllAvailableTaskGroups = function(){
  var taskGroups = [];
  var availableGroups = this.availableTaskGroups();
  for(var i=0; i<availableGroups.length; ++i){
    taskGroups.push(this.getTaskGroup(availableGroups[i]));
  }
  return taskGroups;
};



module.exports = GroupLoader;