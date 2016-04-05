/**
 * Module that exports a number of functions for adding ready-made tasks to Gulp builds.
 *
 * @file
 */
"use strict";

/**
 * A reference to the global build config object.
 *
 * @type {module:gulp-kitchen-sink/types/build-config}
 * @private
 * @inner
 * @memberof module:gulp-kitchen-sink
 *
 * @see module:gulp-kitchen-sink/shared/config
 */
const globalConfig = require('./shared/config');




/**
 * Constructs a Gulp Kitchen Sink instance.
 *
 * This class provides the main user-facing API of the `gulp-kitchen-sink` package.
 * It allows you to collect your project's build configuration in a central place
 * and easily add various ready-made Gulp tasks.
 *
 * @param {external:gulp} gulp    The Gulp instance to use.
 *
 * @constructor
 * @alias module:gulp-kitchen-sink~KitchenSink
 */
function KitchenSink(gulp){

  /**
   * The build config to use.
   *
   * @member {module:gulp-kitchen-sink/types/build-config}
   *
   * @see module:gulp-kitchen-sink/shared/config
   */
  this.config = globalConfig;

  /**
   * The task group loader to use.
   *
   * @member {module:gulp-kitchen-sink/types/group-loader}
   * @private
   */
  this._groupLoader = new (require('./types/group-loader'))(gulp, this.config);
}

/**
 * Adds a Gulp task identified by its group name and action name.
 *
 * `gulp-kitchen-sink` organises its available Gulp tasks into logical **groups**, each
 * with a short name (usually after the kind of files those tasks relate to). Each group
 * of tasks contains a number of **actions**, which each correspond to a task that can
 * be added to Gulp.
 *
 * This method will add a task, identified by its group name and action name, to Gulp.
 * When the task is added to Gulp, its task name is generated from the group name, action
 * name and the build configuration settings and returned. This can be useful for
 * referencing the task elsewhere in your gulpfile without hard-coding its name.
 *
 * @example <caption>Adding a Gulp task and referencing its name</caption>
 *
 * // Add the LESS build task to Gulp
 * var lessBuildTask = kitchenSink.addTask('less','build');
 *
 * // Use the returned task name as dependency elsewhere
 * gulp.task('default', ['foo', 'bar', lessBuildTask]);
 *
 *
 *
 * @param {string} groupName    The name of the task group, whose action should be added as a task.
 * @param {string} actionName   The name of the action within the task group that should be added as a task.
 * @returns {string}            The complete task name of the task that was added to Gulp.
 */
KitchenSink.prototype.addTask = function(groupName, actionName){
  return this._groupLoader.getTaskGroup(groupName).loadTask(actionName, this._groupLoader.gulp);
};

/**
 * Adds all Gulp tasks from a particular group.
 *
 * This method will add tasks for all action within the specified task group to Gulp.
 * When the tasks are added to Gulp, their task names are generated from their respective
 * group names, action names and the build configuration settings. A list of all generated
 * task names is returned. This can be useful for referencing the tasks elsewhere in your gulpfile
 * without hard-coding its name.
 *
 *
 * @param {string} groupName    The name of the task group, whose actions should be added as tasks.
 * @returns {string[]}          The complete task names of the tasks that were added to Gulp.
 */
KitchenSink.prototype.addTasks = function(groupName){
  return this._groupLoader.getTaskGroup(groupName).loadAllTasks(this._groupLoader.gulp);
};

/**
 * Returns a list of available task group names.
 *
 * This method may be useful for debugging or for tools that build on
 * `gulp-kitchen-sink`. It's probably not very useful in a typical
 * gulpfile though.
 *
 * @returns {string[]}  All available task group names.
 */
KitchenSink.prototype.listTaskGroups = function(){
  return this._groupLoader.availableTaskGroups();
};

/**
 * Returns a list of available action names in a given task group.
 *
 * This method may be useful for debugging or for tools that build on
 * `gulp-kitchen-sink`. It's probably not very useful in a typical
 * gulpfile though.
 *
 * @param {string} groupName    The group whose action names should be returned.
 * @returns {string[]}          All available action names from the task group.
 */
KitchenSink.prototype.listTaskGroupActions = function(groupName){
  return this._groupLoader.getTaskGroup(groupName).getActions();
};



/**
 * This module exports the Gulp Kitchen Sink, which allows you to easily
 * add ready-made, battle-hardened and easily configurable Gulp tasks to
 * your gulpfile.
 *
 * Refer to the {@link module:gulp-kitchen-sink~KitchenSink|KitchenSink class's
 * API docs} for details on the various members and methods available to you.
 *
 * @example <caption>A simple gulpfile constructed with the aid of the kitchen sink</caption>
 *
 * var gulp = require('gulp');
 * var kitchenSink = require('gulp-kitchen-sink')(gulp);
 *
 * // Configure our build
 * kitchenSink.config.paths.srcRoot = './source/';
 *
 * // Add some of kitchen sink's ready-made tasks
 * var lessBldTask = kitchenSink.addTask('less','build');
 * var htmlCpTask = kitchenSink.addTask('html','cp');
 *
 * // Default Gulp task
 * gulp.task('default', [lessBldTask, htmlCpTask]);
 *
 *
 * @param {external:gulp} gulp    The Gulp instance to use.
 *
 * @returns {module:gulp-kitchen-sink~KitchenSink}  The Gulp Kitchen Sink!
 *
 * @module gulp-kitchen-sink
 */
module.exports = function(gulp){return new KitchenSink(gulp);}