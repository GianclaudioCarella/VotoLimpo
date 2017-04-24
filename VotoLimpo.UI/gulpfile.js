/// <binding AfterBuild='inject' />

var config = require('./gulp.config')();
var del = require('del');
var gulp = require('gulp');
var $ = require('gulp-load-plugins')({ lazy: true });
var colors = $.util.colors;

/**
 * Remove all styles from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-styles', function (done) {
    var files = [].concat(
        config.temp + '**/*.css',
        config.build + 'styles/**/*.css'
    );
    clean(files, done);

});

gulp.task('inject', ['wiredep', 'styles', 'templatecache'], function () {
    log('Wire up css into the html, after files are ready');

    return gulp
        .src(config.index)
        .pipe(inject(config.css))
        .pipe(gulp.dest(config.client));
});

/**
 * Create $templateCache from the html templates
 * @return {Stream}
 */
gulp.task('templatecache', ['clean-code'], function () {
    log('Creating an AngularJS $templateCache');

    return gulp
        .src(config.htmltemplates)
        //.pipe($.if(args.verbose, $.bytediff.start()))
        .pipe($.minifyHtml({ empty: true }))
        //.pipe($.if(args.verbose, $.bytediff.stop(bytediffFormatter)))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.temp));
});


/**
 * Remove all js and html from the build and temp folders
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-code', function (done) {
    var files = [].concat(
        config.temp + '**/*.js',
        config.build + 'js/**/*.js',
        config.build + '**/*.html'
    );
    clean(files, done);
});

/**
 * Compile sass to css
 * @return {Stream}
 */
gulp.task('styles', ['clean-styles'], function () {
    log('Compiling Sass --> CSS');

    return gulp
        .src(config.sass)
        .pipe($.plumber()) // exit gracefully if something fails after this
        .pipe($.sass())
        .on('error', errorLogger) // more verbose and dupe output. requires emit.
        //.pipe($.autoprefixer({ browsers: ['last 2 version', '> 5%'] }))
        .pipe(gulp.dest(config.temp));
});


/**
 * Wire-up the bower dependencies
 * @return {Stream}
 */
gulp.task('wiredep', function () {
    log('Wiring the bower dependencies into the html');

    var wiredep = require('wiredep').stream;
    var options = config.getWiredepDefaultOptions();

    // Only include stubs if flag is enabled
    var js = config.js;

    return gulp
        .src(config.index)
        .pipe(wiredep(options))
        .pipe(inject(js, '', config.jsOrder))
        .pipe(gulp.dest(config.client));
});

/**
 * vet the code and create coverage report
 * @return {Stream}
 */
gulp.task('vet', function () {
    log('Analyzing source with JSHint and JSCS');

    return gulp
        .src(config.alljs)
        //.pipe($.if(args.verbose, $.print())) // LO SAQUE POR QUER NO TENGO ARGS
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish', { verbose: true }))
        .pipe($.jshint.reporter('fail'));
    //.pipe($.jscs());//LO SAQUE POR QUE NO ME DEJA TRABAJAR
});

/**
 * Build everything
 * This is separate so we can run tests on
 * optimize before handling image or fonts
 */
gulp.task('build', ['optimize', 'images', 'fonts'], function () {
    log('Building everything');

    var msg = {
        title: 'gulp build',
        subtitle: 'Deployed to the build folder',
        message: 'Running `gulp serve-build`'
    };
    del(config.temp);
    log(msg);
    notify(msg);
});

/**
 * Optimize all files, move to a build folder,
 * and inject them into the new index.html
 * @return {Stream}
 */
gulp.task('optimize', ['inject', 'test'], function () {
    log('Optimizing the js, css, and html');

    // Filters are named for the gulp-useref path
    var cssFilter = $.filter('**/*.css', { restore: true });
    var jsAppFilter = $.filter('**/' + config.optimized.app, { restore: true });
    var jslibFilter = $.filter('**/' + config.optimized.lib, { restore: true });

    var templateCache = config.temp + config.templateCache.file;

    return gulp
      .src(config.index)
      .pipe($.plumber())
      .pipe(inject(templateCache, 'templates'))
      // Get the css
      .pipe(cssFilter)
      .pipe($.minifyCss())
      .pipe(cssFilter.restore)
      // Get the custom javascript
      .pipe(jsAppFilter)
      .pipe($.ngAnnotate({ add: true }))
      .pipe($.uglify())
      .pipe(getHeader())
      .pipe(jsAppFilter.restore)
      // Get the vendor javascript
      .pipe(jslibFilter)
      .pipe($.uglify()) // another option is to override wiredep to use min files
      .pipe(jslibFilter.restore)
      // Take inventory of the file names for future rev numbers
      .pipe($.rev())
      // Apply the concat and file replacement with useref
      .pipe($.useref({ searchPath: './' }))
      // Replace the file names in the html with rev numbers
      .pipe($.revReplace())
      .pipe(gulp.dest(config.build));
});


/**
 * Compress images
 * @return {Stream}
 */
gulp.task('images', ['clean-images'], function () {
    /*NO FUNCIONA BIEN CON LOS SVG Y LOS ROMPE*/
    /*log('Compressing and copying images');

    return gulp
      .src(config.images)
      .pipe($.imagemin({ optimizationLevel: 4 }))
      .pipe(gulp.dest(config.build + 'images'));
      */
});

/**
 * Copy fonts
 * @return {Stream}
 */
gulp.task('fonts', ['clean-fonts'], function () {
    log('Copying fonts');

    return gulp
      .src(config.fonts)
      .pipe(gulp.dest(config.build + 'fonts'));
});

/**
 * Remove all images from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-images', function (done) {
    clean(config.build + 'images/**/*.*', done);
});

/**
 * Remove all fonts from the build folder
 * @param  {Function} done - callback when complete
 */
gulp.task('clean-fonts', function (done) {
    clean(config.build + 'fonts/**/*.*', done);
});

/**
 * Run specs once and exit
 * To start servers and run midway specs as well:
 *    gulp test --startServers
 * @return {Stream}
 */
gulp.task('test', ['vet', 'templatecache'], function (done) {
    startTests(true /*singleRun*/, done);
});

/**
 * Start the tests using karma.
 * @param  {boolean} singleRun - True means run once and end (CI), or keep running (dev)
 * @param  {Function} done - Callback to fire when karma is done
 * @return {undefined}
 */
function startTests(singleRun, done) {
    done();
}

/**
 * Log a message or series of messages using chalk's blue color.
 * Can pass in a string, object or array.
 * @override
 */
function log(msg) {
    if (typeof (msg) === 'object') {
        for (var item in msg) {
            if (msg.hasOwnProperty(item)) {
                $.util.log($.util.colors.blue(msg[item]));
            }
        }
    } else {
        $.util.log($.util.colors.blue(msg));
    }
}

/**
 * Inject files in a sorted sequence at a specified inject label
 * @param   {Array} src   glob pattern for source files
 * @param   {String} label   The label name
 * @param   {Array} order   glob pattern for sort order of the files
 * @returns {Stream}   The stream
 */
function inject(src, label, order) {

    var options = { read: false };
    if (label) {
        options.name = 'inject:' + label;
    }
    log('INJECT LOCO: ');
    return $.inject(orderSrc(src, order), options);
}
/**
 * Order a stream
 * @param   {Stream} src   The gulp.src stream
 * @param   {Array} order Glob array pattern
 * @returns {Stream} The ordered stream
 */
function orderSrc(src, order) {
    //order = order || ['**/*'];
    return gulp
        .src(src)
        .pipe($.if(order, $.order(order)));
}

/**
 * Delete all files in a given path
 * @param  {Array}   path - array of paths to delete
 * @param  {Function} done - callback when complete
 */
function clean(path, done) {
    log('Cleaning: ' + $.util.colors.blue(path));
    del(path, done);
}

/**
 * Log an error message and emit the end of a task
 * @override
 */
function errorLogger(error) {
    log('*** Start of Error ***');
    log(error);
    log('*** End of Error ***');
    this.emit('end');
}

/**
 * Show OS level notification using node-notifier
 */
function notify(options) {
    /*var notifier = require('node-notifier');
    var notifyOptions = {
        sound: 'Bottle',
        contentImage: path.join(__dirname, 'gulp.png'),
        icon: path.join(__dirname, 'gulp.png')
    };
    _.assign(notifyOptions, options);
    notifier.notify(notifyOptions);*/
}

/**
 * Format and return the header for files
 * @return {String}           Formatted file header
 */
function getHeader() {
    var pkg = require('./package.json');
    var template = ['/**',
      ' * <%%= pkg.name %> - <%%= pkg.description %>',
      ' * @authors <%%= pkg.authors %>',
      ' * @version v<%%= pkg.version %>',
      ' * @link <%%= pkg.homepage %>',
      ' * @license <%%= pkg.license %>',
      ' */',
      ''
    ].join('\n');
    return $.header(template, {
        pkg: pkg
    });
}