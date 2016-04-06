# gulp-kitchen-sink
A collection of useful Gulp tasks and utilities.

`gulp-kitchen-sink` contains a number of useful Gulp tasks for common web development build activities. It comes with a small API to conveniently configure and add its tasks into your `gulpfile.js`.

Here's a simple example showing how Gulp Kitchen Sink can help simplify your gulpfile for common tasks:

```js
var gulp = require('gulp');
var kitchenSink = require('gulp-kitchen-sink')(gulp);

// Configure our build
kitchenSink.config.paths.srcRoot = './source/';

// Add some of kitchen sink's ready-made tasks
var lessBldTask = kitchenSink.addTask('less','build');
var htmlCpTask = kitchenSink.addTask('html','cp');

// Default Gulp task
gulp.task('default', [lessBldTask, htmlCpTask]);
```

For advanced users, the Gulp Kitchen Sink's innards are thoroughly documented and you are welcome to pick and mix components (for instance various lazypipes it uses under the hood) for your own nefarious purposes!

## Installation

1. Ensure that you have `gulp` installed.
1. Install `gulp-kitchen-sink` into your project as a development dependency using NPM:

    `npm install --save-dev gulp-kitchen-sink`

_Note:_ `gulp-kitchen-sink` will install quite a few Gulp plug-ins as its own dependencies. As long as you only incorporate them via its own tasks, you will not need to install these yourself.

## Usage

Require `gulp-kitchen-sink` in your `gulpfile.js` and pass it `gulp`:

```js
// Require Gulp (you probably have this bit already)
var gulp = require('gulp');

// Now create the kitchen sink
var kitchenSink = require('gulp-kitchen-sink')(gulp); // <-- Don't forget to add the (gulp) bit!
```

Customise the Gulp Kitchen Sink's build configuration:

```js
// Change the root location of your source files
// (The default is './src')
kitchenSink.config.paths.srcRoot = './my-source-files/';

// Add a prefix that will be prepended to generated task names
kitchenSink.config.tasks.defaultPrefixName = 'foobar';

// Specify some LESS files (relative to the srcRoot we set
// above) that LESS tasks will process
kitchenSink.config.less.srcFiles = ['foo.less', 'bar.less'];
```

Refer to the API docs for a full list of all available configuration parameters and their default values.

Next up, add some of the Kitchen Sink's built-in Gulp tasks. As you do so, Kitchen Sink will generate names for the tasks. Depending on the configuration you set earlier, the names of the tasks may vary. Therefore, it will return the name for each task you add, in case you need to reference it later:

```js
// This adds the built-in LESS build task, which simply
// compiles all your LESS source files and writes the
// CSS out to a folder in your build directory.
// Using the example config above, the returned task name
// would be "foobar:less:build".
var lessBldTask = kitchenSink.addTask('less', 'build');
```

Refer to the API docs for a full list of all available tasks and what they do.

Finally, you might want to reference some of the Gulp Kitchen Sink tasks you added within your own tasks as dependencies. This is where the returned names come in handy:

```js
// By using the lessBldTask variable instead of hard-coding the
// task name as "foobar:less:build" we ensure that this will continue
// to work if the config is ever changed in a way that affects the
// generated task name:
gulp.task('default', ['my-foo-task', lessBldTask]);
```
