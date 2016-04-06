/**
 * Module that exports a shared build config instance.
 *
 * @file
 *
 * @see module:gulp-kitchen-sink/types/build-config
 */
"use strict";

const BuildConfig = require('../types/build-config');

/**
 * A shared build config instance.
 *
 * For details of the supported properties and methods, please refer to the
 * {@link module:gulp-kitchen-sink/types/build-config|build config module's
 * documentation}.
 *
 * This shared build config is, in effect a singleton, so wherever it is `required()`,
 * those references will be pointing to the same object.
 *
 * Many `gulp-kitchen-sink` modules that require a build config object will default to this
 * one if none is provided.
 *
 * @see module:gulp-kitchen-sink/types/build-config
 *
 * @module gulp-kitchen-sink/shared/config
 */
module.exports = new BuildConfig();
