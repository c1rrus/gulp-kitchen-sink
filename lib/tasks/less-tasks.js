/**
 * Module that exports a function that will add a number of LESS-related
 * tasks to Gulp.
 *
 * @file
 *
 * @see tasksModuleFn
 */
"use strict";

// Name components
const fallbackGroupName = 'less';
const actionNameBuild = 'build';
const actionNameHint = 'hint';

// Imports
const pipes = require('../lazypipes/less-pipes');



/**
 * Function that adds a number of LESS-related tasks to Gulp.
 *
 *
 * @param {external:gulp} gulp    The gulp instance that the tasks will be added to.
 * @param {boolean} [lazyload]    If omitted or `false`, all tasks within the task group will immediately be
 *                                added to Gulp (this is the default behaviour).
 *                                If `true`, tasks will **not** be added to Gulp.
 * @param {module:gulp-kitchen-sink/types/build-config} [config]
 *                                The build config that will be passed to the task group when it is created.
 *                                If none is provided, the global config object will be used.
 * @param {string} [groupName]
 *
 * @returns {module:gulp-kitchen-sink/types/task-group}
 *                                A task group containing LESS-related actions that were added to Gulp as tasks
 *                                (unless the `lazyload` flag was set).
 *
 * @module gulp-kitchen-sink/tasks/less-tasks
 *
 * @see tasksModuleFn
 */
module.exports = require('../types/task-group').createTasksModule(fallbackGroupName, function(tasks, gulp){

  const config = tasks.config;

  /*
   Compiles all LESS source files and writes the resulting
   CSS to the dist folder.
   */
  tasks.addAction(actionNameBuild, function(){
    const buildPipe = pipes.createBuildPipe( config.less.lessConfig );

    return gulp.src( config.srcGlobs(config.less.srcFiles) )
      .pipe(buildPipe())
      .pipe(gulp.dest( config.bldPath(config.less.bldDir) ));
  });

  /*
   Runs all LESS source files through the LESS hinter and
   reports any warnings or errors.
   */
  tasks.addAction(actionNameHint, function(){
    const hintPipe = pipes.createHintPipe( config.less.lessHintConfig );

    return gulp.src( config.srcGlobs(config.less.srcFiles) )
      .pipe(hintPipe());
  });

});
