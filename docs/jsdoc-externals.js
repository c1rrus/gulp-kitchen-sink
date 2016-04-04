/**
 * Only contains JSDoc docblocks for describing external types referenced elsewhere in the in-source docblocks.
 *
 * Since some of these external types are referenced in multiple places, it didn't feel right to put them into one
 * JS file or another, so for that reason  they have been split out into here.
 *
 * @file
 */


/**
 * An instance of Gulp.
 *
 * The streaming build system {@link http://gulpjs.com/|http://gulpjs.com}
 *
 * @external gulp
 * @see {@link https://github.com/gulpjs/gulp/blob/master/docs/API.md|Gulp API docs}
 */

/**
 * Performs the Gulp task's main operations.
 *
 * Refer to {@link https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulptaskname--deps-fn|Gulp's API documentation}
 * for the expected behaviours.
 *
 * @callback external:gulp~gulpTaskFn
 *
 * @param {function} [cb]  Callback function to indicate when the task has completed.
 * @returns {void|Stream|Promise} Returns nothing if the function accepted a callback or runs synchronously.
 *                                Otherwise it must return a Node Stream or a Promise.
 *
 * @see {@link https://github.com/gulpjs/gulp/blob/master/docs/API.md#gulptaskname--deps-fn|Gulp's API documentation}
 */


/**
 * A lazypipe.
 *
 * Lazypipe allows you to create an immutable, lazily-initialized pipeline. It's designed to be used
 * in an environment where you want to reuse partial pipelines, such as with {@link external:gulp|gulp}.
 *
 * @external lazypipe
 * @see {@link https://github.com/OverZealous/lazypipe#api|Lazypipe API docs}
 */