/**
 * This module exports a group of LESS tasks.
 *
 * @module gulp-kitchen-sink/tasks/less-tasks
 */
"use strict";

// Name components
const groupName = 'less';
const actionNameBuild = 'build';
const actionNameHint = 'hint';

// Imports
const pipes = require('../lazypipes/less-pipes');
const GulpTaskGroup = require('../types/task-group');


/*
 * Returns a task group containing a number of LESS-related actions.
 *
 * For compatibility with the 'gulp-load' plug-in, this module actually exports
 * a function that takes an instance of Gulp as its 1st argument and then adds
 * all tasks in this group to Gulp.
 *
 * To prevent the default auto-loading behaviour (e.g. to selectively create specific
 * tasks), add a 2nd argument with the boolean value true.
 *
 * @param gulp
 * @param lazyload
 * @param config
 * @returns {GulpTaskGroup}
 */


/**
 *
 * @type {Function}
 */
module.exports = GulpTaskGroup.createTasksModule(groupName, function(tasks, gulp){

  /*
   Compiles all LESS source files and writes the resulting
   CSS to the dist folder.
   */
  tasks.addAction(actionNameBuild, function(){
    const buildPipe = pipes.createBuildPipe( /* less options */ );

    return gulp.src( /* src globs */ )
      .pipe(buildPipe())
      .pipe(gulp.dest( /* dest globs */ ));
  });

  /*
   Runs all LESS source files through the LESS hinter and
   reports any warnings or errors.
   */
  tasks.addAction(actionNameHint, function(){
    const hintPipe = pipes.createHintPipe( /* less hint options */ );

    return gulp.src( /* src globs */ )
      .pipe(hintPipe());
  });

});
