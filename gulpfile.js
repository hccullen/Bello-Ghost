var gulp = require('gulp');

// gulp plugins and utils
var gutil = require('gulp-util');
var livereload = require('gulp-livereload');
var nodemon = require('gulp-nodemon');
var postcss = require('gulp-postcss');
var sourcemaps = require('gulp-sourcemaps');
var gulpCopy = require('gulp-copy');

// postcss plugins
var autoprefixer = require('autoprefixer');
var colorFunction = require('postcss-color-function');
var cssnano = require('cssnano');
var customProperties = require('postcss-custom-properties');
var easyimport = require('postcss-easy-import');
var zip = require('gulp-zip');

var swallowError = function swallowError(error) {
    gutil.log(error.toString());
    gutil.beep();
    this.emit('end');
};

var nodemonServerInit = function () {
    livereload.listen(1234);
};

gulp.task('build', ['css', 'package-copy'], function (/* cb */) {
    // return nodemonServerInit();
});


gulp.task('package-copy', function () {
    gulp.src('package.json')
    .pipe(gulpCopy('/src'))
});


gulp.task('css', function () {
    var processors = [
        easyimport,
        customProperties,
        colorFunction(),
        autoprefixer({browsers: ['last 2 versions']}),
        cssnano()
    ];
    gulp.src('src/assets/css/*.css')
        .on('error', swallowError)
        .pipe(sourcemaps.init())
        .pipe(postcss(processors))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('src/assets/built/'));
});

gulp.task('watch', function () {
    gulp.watch('src/assets/css/**', ['css']);
});

gulp.task('default', ['build'], function () {
    gulp.start('watch');
});

gulp.task('generate', ['build'], () =>
    gulp.src('src/**/*')
        .pipe(zip('bello-casper.zip'))
        .pipe(gulp.dest(''))
);
