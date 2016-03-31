/**
 *
 * @module gulp-kitchen-sink
 */
"use strict";


module.exports = {

  lessPipes: require('./lazypipes/less-pipes'),
  lessTasks: require('./tasks/less-tasks'),

  config: require('./shared/config')
};
