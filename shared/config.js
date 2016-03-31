/**
 *  Exports a global build configuration instance.
 *
 *
 *
 */
"use strict";

const BuildConfig = require('../types/build-config');

// Create a global instance of BuildConfig that can be shared
// amongst other modules
module.exports = new BuildConfig();
