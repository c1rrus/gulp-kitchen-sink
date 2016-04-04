/**
 * Only contains JSDoc docblocks for describing global types referenced elsewhere in the in-source docblocks.
 *
 * Since some of these global types are referenced in multiple places, it didn't feel right to put them into one
 * JS file or another, so for that reason  they have been split out into here.
 *
 * @file
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
 *                                If none is provided, the global config object will be used.
 *
 * @returns {module:gulp-kitchen-sink/types/task-group}
 *                                A task group containing the actions that were added to Gulp as tasks
 *                                (unless the `lazyload` flag was set).
 *
 * @see module:gulp-kitchen-sink/types/task-group.createTasksModule
 */
