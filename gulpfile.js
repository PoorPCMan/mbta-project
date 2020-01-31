var gulp = require('gulp'); //JS task runner
var sass = require('gulp-sass'); //Compiles CSS
var sourcemaps = require('gulp-sourcemaps'); //Maps browser to .SCSS files
var rename = require('gulp-rename'); //Rename files
var postcss = require("gulp-postcss"); //Base node modules for cssnon and autoprefixer
var autoprefixer = require("autoprefixer"); //CSS selector pre-fixes for multiple browsers
var cssnano = require("cssnano"); //Minify CSS
var path = require('path'); //Utility for file and directory access
var webpackStream = require('webpack-stream'); //JS Bundler
var named = require('vinyl-named'); //Renamer - webpack-stream dependency
var uglify = require('gulp-uglify'); //Minify JS
var browserSync = require('browser-sync').create(); //Sync changes to browser

var paths = {
    public: 'public',
    sass: 'sass/**/*.scss',
    css: 'css',
    javascript: 'js/**/*.js',
    js: 'js'
};

//Tasks
gulp.task('build:css', function(){
    return gulp.src(paths.sass)
            .pipe(sourcemaps.init())
            .pipe(sass())
            .pipe(rename({ suffix: '.min', basename: 'style' }))
            .pipe(postcss([autoprefixer(), cssnano()]))
            .pipe(sourcemaps.write())
            .pipe(gulp.dest(path.join(paths.public, paths.css)))
            .pipe(browserSync.stream());
});

gulp.task('build:js', function(){
    return gulp.src(paths.javascript)
            .pipe(sourcemaps.init())
            .pipe(sourcemaps.write())
            .pipe(named(function () {return "main.min"}))
            .pipe(webpackStream())
            .pipe(uglify())
            .pipe(gulp.dest(path.join(paths.public, paths.js)))
            .pipe(browserSync.stream());
});

gulp.task('build', gulp.series('build:css', 'build:js'));

//Watchers
gulp.task('watch:css', function(){
    gulp.watch(paths.sass, gulp.series('build:css'));
});

gulp.task('watch:js', function(){
    gulp.watch(paths.javascript, gulp.series('build:js'));
});

gulp.task('watch', gulp.parallel('watch:css', 'watch:js'));

// Serve
gulp.task('serve', function () {
    browserSync.init({
        server: {
            baseDir: paths.public,
            index: 'index.html'
        }
    });

    gulp.series('build');
    gulp.watch('public/index.html').on('change', browserSync.reload);
    gulp.watch(paths.sass, gulp.series('build:css')).on('change', browserSync.reload);
    gulp.watch(paths.javascript, gulp.series('build:js')).on('change', browserSync.reload);
});