/**
 * This module exports a class for creating objects that store build configuration
 * options.
 *
 * The intent is to centralise and standardise build configuration options which can
 * then be shared by the various re-usable pipes and tasks.
 *
 * @module gulp-kitchen-sink/types/build-config
 */
"use strict";

/**
 * The separating character used between the prefixName, groupName and actionName
 * components of a generated Gulp task name.
 *
 * @type {string}
 */
const TASK_NAME_SEPARATOR = ':';




/**
 * Constructs a build configuration object populated with default
 * settings.
 *
 * @constructor
 */
function BuildConfig(){
  // Set some config sensible defaults

  // Main path roots
  this.paths = {
    srcRoot:      'src',
    bldRootDev:   'dist',
    bldRootProd:  'dist'
  };

  // Task-related configs
  this.tasks = {
    defaultPrefixName:  false,
    groupBeforeAction:  true
  }

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
 * @param dir         The directory path to check.
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
 * Note that this function uses Node's path.join(), so suffixes
 * that go up the directory tree will be processed relative to
 * the source directory path.
 *
 * @param suffix      An optional path suffix, relative to the
 *                    source directory.
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
 * @param globs...    Any number of strings and/or arrays of strings, which
 *                    are each glob patterns relative to the source dir.
 * @returns {*}       Either a single, de-duplicated array of full path glob
 *                    patterns, or if there is only one unique glob it is
 *                    returned as a string.
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
 * Note that this function uses Node's path.join(), so suffixes
 * that go up the directory tree will be processed relative to
 * the build directory path.
 *
 * @param suffix      An optional path suffix, relative to the
 *                    build directory.
 *
 * @returns {String}  The build directory path with the suffix
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
 * @param componentsOrGroupName   Either the group name or an object
 *                                with 'group', 'action' and 'prefix'
 *                                properties containing the corresponding
 *                                task name components.
 *                                If an object is provided, it will be used
 *                                to generate the task name and subsequent
 *                                parameters will be ignored.
 * @param actionName              The action name.
 * @param prefixName              The option prefix name.
 *                                If given, this will override any default
 *                                prefix name set in this config object.
 * @returns {String}              A complete Gulp task name.
 */
BuildConfig.prototype.createTaskName = function(componentsOrGroupName, actionName, prefixName){
  var group, action, prefix;
  if(typeof componentsOrGroupName === 'object'){
    group = componentsOrGroupName.group;
    action = componentsOrGroupName.action;
    prefix = componentsOrGroupName.prefix || this.tasks.defaultPrefixName;
  }
  else{
    group = componentsOrGroupName;
    action = actionName;
    prefix = prefixName || this.tasks.defaultPrefixName;
  }

  var taskName;
  if( this.tasks.groupBeforeAction ){
    taskName = group + TASK_NAME_SEPARATOR + action;
  }
  else{
    taskName = action + TASK_NAME_SEPARATOR + group;
  }

  if(prefix){
    taskName = prefix + TASK_NAME_SEPARATOR + taskName;
  }

  return taskName;
};



module.exports = BuildConfig;
