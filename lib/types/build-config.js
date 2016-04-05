/**
 * Module that exports a class for creating objects that store build configuration
 * options.
 *
 * The intent is to centralise and standardise build configuration options which can
 * then be shared by the various re-usable pipes and tasks.
 *
 * @see module:gulp-kitchen-sink/types/build-config
 *
 * @file
 */
"use strict";

const path = require('path');


/**
 * The separating character used between the prefixName, groupName and actionName
 * components of a generated Gulp task name.
 *
 * @type {string}
 * @default
 *
 * @memberof module:gulp-kitchen-sink/types/build-config~
 * @private
 */
const TASK_NAME_SEPARATOR = ':';




/**
 * This module exports a build config constructor.
 *
 * Build config objects hold all the configuration parameters for
 * a Gulp build (source directories, build directories, plug-in
 * options, etc.) in a central place. Other `gulp-kitchen-sink`
 * modules are designed to work with these config objects.
 *
 * Most of the time, you will only need a singleton instance of a
 * build config for your Gulp files. The
 * {@link module:gulp-kitchen-sink/shared/config|shared config module}
 * provides just that, so usually it's preferable to grab that and
 * modify its properties rather than creating your own build config
 * instances.
 *
 * @example <caption>Creating and using a new build config instance</caption>
 *
 * // Construct new build config
 * var bldConfig = new (require('gulp-kitchen-sink/types/build-config'))();
 *
 * // Set a property
 * bldConfig.paths.srcRoot = './source-files';
 *
 * // Use a method
 * bldConfig.srcGlobs('less/*.less', 'vendor/bootstrap.less');
 * // Returns ['source-files/less/*.less', 'source-files/vendor/bootstrap.less']
 *
 * @constructor
 *
 * @exports gulp-kitchen-sink/types/build-config
 *
 * @see module:gulp-kitchen-sink/shared/config
 */
function BuildConfig(){

  /**
   * The path components used for the build.
   *
   * @member {object}
   *
   * @property {string} srcRoot=src       The root directory of all source files.
   * @property {string} bldRootDev=dist   The root directory of development build output
   * @property {string} bldRootProd=dist  The root directory of production build output
   */
  this.paths = {
    srcRoot:      'src',
    bldRootDev:   'dist',
    bldRootProd:  'dist'
  };

  /**
   * Settings relating to Gulp tasks.
   *
   * @member {object}
   *
   * @property {string|boolean} defaultPrefixName=false     The namespace prefix to prepend to generated
   *                                                        Gulp task names. (Set to false or an empty
   *                                                        string to disable prefixes)
   * @property {boolean} groupBeforeAction=true             Whether to put task group names before action
   *                                                        names, when generating task names (`true`). Or
   *                                                        whether to flip the order (`false`).
   *
   */
  this.tasks = {
    defaultPrefixName:  false,
    groupBeforeAction:  true
  };


  /**
   *
   */
  this.less = {
    srcFiles: 'less/**/*.less',
    bldDir: 'less',
    lessConfig: {},
    lessHintConfig: {}
  };

}

// ########## Static methods

/**
 * Returns the given directory path with a trailing
 * slash appended, if needed.
 *
 * If the directory already had a trailing slash,
 * it will be returned as is.
 *
 * This function is useful for situations where you
 * want to guarantee that a path ends with a slash.
 *
 * @param {string} dir         The directory path to check.
 *
 * @returns {string}  The directory path with a guaranteed
 *                    trailing slash at the end.
 */
BuildConfig.addTrailingSlash = function(dir){
  if(dir.substr(-1) !== path.sep){
    return dir + path.sep;
  }
  else{
    return dir;
  }
};


// ########## Instance methods

/**
 * Returns the source directory path (with a guaranteed trailing
 * slash) or appends a path to the source path.
 *
 * Note that this function uses Node's `path.join()`, so suffixes
 * that go up the directory tree will be processed relative to
 * the source directory path.
 *
 * @example
 *
 * // Set our source root
 * bldConfig.paths.srcRoot = 'foo/bar';
 *
 * bldConfig.srcPath();
 * // Returns: 'foo/bar/'
 *
 * bldConfig.srcPath('baz.txt');
 * // Returns: 'foo/bar/baz.txt'
 *
 * @param {string} [suffix]       An optional path suffix, relative to the
 *                              source directory.
 *
 * @returns {string}  The source directory path with the suffix
 *                    appended.
 */
BuildConfig.prototype.srcPath = function(suffix){
  if(suffix){
    return path.join(this.paths.srcRoot, suffix);
  }
  else{
    return BuildConfig.addTrailingSlash(this.paths.srcRoot);
  }
};

/**
 * Takes any number of glob patterns, relative to the source directory,
 * and returns them as a single array of full glob patterns.
 *
 * Accepts any number of glob strings and/or arrays of glob strings
 * as parameters. Each individual glob provided will be appended to the
 * source directory path (using srcPath()), so that the output contains
 * full path globs.
 *
 * The output will always be a single, de-duplicated array of glob strings
 * (or, if there is only one unique pattern, a glob string). This method is
 * therefore useful for creating (an arrays) globs to be used with Gulp
 * plug-ins like gulp.src().
 *
 * @example <caption>No args or empty args</caption>
 *
 * // Set our source root
 * bldConfig.paths.srcRoot = 'foo';
 *
 * bldConfig.srcGlobs();
 * // Returns: 'foo/'
 *
 * bldConfig.srcGlobs([]);
 * bldConfig.srcGlobs('');
 * // Both return: 'foo/'
 *
 *
 * @example <caption>String args</caption>
 *
 * bldConfig.srcGlobs('*.html');
 * // Returns: 'foo/*.html'
 *
 * bldConfig.srcGlobs('foo.html', 'bar.html', 'baz/*.html');
 * // Returns: ['foo/foo.html', 'foo/bar.html', 'foo/baz/*.html']
 *
 *
 * @example <caption>Array args</caption>
 *
 * bldConfig.srcGlobs(['img/*.jpg','img/*.png','img/*.gif']);
 * // Returns: ['foo/img/*.jpg','foo/img/*.png','foo/img/*.gif']
 *
 *
 * @example <caption>Mixed args</caption>
 *
 * bldConfig.srcGlobs(
 *    ['img/*.jpg','img/*.png','img/*.gif'],
 *    'index.html',
 *    ['index.html', 'about.html']
 * );
 * // Returns [
 * //   'foo/img/*.jpg','foo/img/*.png','foo/img/*.gif',
 * //   'foo/index.html','foo/about.html'
 * // ]
 * // Note how 'foo/index.html' only appears once in the output!
 *
 * @param {...(string|string[])} [globs]
 *                    Any number of strings and/or arrays of strings, which
 *                    are each glob patterns relative to the source dir.
 *
 * @returns {string|string[]}
 *                    Either a single, de-duplicated array of full path glob
 *                    patterns, or if there is only one unique glob it is
 *                    returned as a string. If no or only empty globs were
 *                    provided, the source directory is returned.
 */
BuildConfig.prototype.srcGlobs = function( /* glob strings and/or arrays */ ){
  // If not suffixes were given, simply return
  // the src path
  if(arguments.length === 0){
    return this.srcPath();
  }

  // Otherwise concatenate all args into a single,
  // de-duplicated array of glob strings
  var globs = [];
  var i, j, arg;
  for(i=0; i<arguments.length; ++i){
    arg = arguments[i];
    if(arg instanceof Array){
      if(arg.length === 0){
        // Skip empty arrays
        continue;
      }
      // Push each element to the globs array
      // unless it already exists
      for(j=0; j<arg.length; ++j){
        if(globs.indexOf(arg[j]) === -1){
          globs.push(arg[j]);
        }
      }
    }
    else{
      // Add value to globs array unless
      // it already exists
      if(globs.indexOf(arg) === -1){
        globs.push(arg);
      }
    }
  }

  // If combined args yielded an empty array,
  // just return the src path
  if(globs.length === 0){
    return this.srcPath();
  }

  // Prepend the src root to each glob
  globs = globs.map(function(suffix){
    return this.srcPath(suffix);
  }, this);

  // If there is only one glob, return
  // it as string...
  if(globs.length === 1){
    return globs[0];
  }
  else {
    return globs;
  }
};

/**
 * Returns the build directory path (with a guaranteed trailing
 * slash) or appends a path to the build path.
 *
 * Note that this function uses Node's `path.join()`, so suffixes
 * that go up the directory tree will be processed relative to
 * the build directory path.
 *
 * @param {string} [suffix]       An optional path suffix, relative to the
 *                                build directory.
 *
 * @returns {string}  The build directory path with the suffix
 *                    appended.
 */
BuildConfig.prototype.bldPath = function(suffix){
  if(suffix){
    return path.join(this.paths.bldRootDev, suffix);
  }
  else{
    return BuildConfig.addTrailingSlash(this.paths.bldRootDev);
  }
};

/**
 * Creates a complete Gulp task name from a group name, action name and
 * optional prefix name.
 *
 * The order of group name and action name are determined by this config
 * object's tasks.groupBeforeAction property. By default the group name
 * precedes the action name, but by setting that property to false you
 * can swap it.
 *
 * If a namespace prefix is provided, it will be prepended. Otherwise,
 * this config object's default prefix (in tasks.defaultPrefixName
 * will be used). If that is blank, no prefix will be added.
 *
 * @param {string} groupName      The task's group name.
 * @param {string} actionName     The task's action name.
 * @param {string} [prefixName]   THe task's prefix name.
 *
 * @returns {string}              A complete Gulp task name.
 */
BuildConfig.prototype.createTaskName = function(groupName, actionName, prefixName){
  // Fallback to default prefix name
  var prefix = prefixName || this.tasks.defaultPrefixName;

  var taskName;
  if( this.tasks.groupBeforeAction ){
    taskName = groupName + TASK_NAME_SEPARATOR + actionName;
  }
  else{
    taskName = actionName + TASK_NAME_SEPARATOR + groupName;
  }

  if(prefix){
    taskName = prefix + TASK_NAME_SEPARATOR + taskName;
  }

  return taskName;
};



module.exports = BuildConfig;
