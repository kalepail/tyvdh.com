var gulp = require('gulp'),
    ghpages = require('gulp-gh-pages'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    globbing = require('gulp-css-globbing'),
    sourcemaps = require('gulp-sourcemaps'),
    imagemin = require('gulp-imagemin'),
    flatten = require('gulp-flatten'),
    newer = require('gulp-newer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    connect = require('gulp-connect'),
    livereload = require('gulp-livereload');

gulp.task('css', function() {
  return gulp.src('dev/sass/application.scss')
    .pipe(sourcemaps.init())
    .pipe(globbing({extensions: '.scss'}))
    .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
    .pipe(autoprefixer({cascade: false}))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/css'));
});

gulp.task('vendor-js', function() {
  return gulp.src('dev/js/vendor/*.js')
    .pipe(sourcemaps.init())
    .pipe(concat('application-vendor.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/js'));
});

gulp.task('js', function() {
  return gulp.src(['dev/js/*/*.js', 'dev/js/*.js', '!dev/js/vendor/*.js'])
    .pipe(sourcemaps.init())
    .pipe(concat('application.js'))
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('public/js'));
});

gulp.task('img', function() {
  return gulp.src('dev/img/**/*.{jpg,jpeg,png,gif,svg,ico}')
    .pipe(flatten())
    .pipe(newer('public/img'))
    .pipe(imagemin({
      optimizationLevel: 5,
      progressive: true,
      interlaced: true,
      svgoPlugins: [{
        collapseGroups: false,
        removeViewBox: false,
        removeXMLProcInst: false
      }]
    }))
    .pipe(gulp.dest('public/img'));
});

gulp.task('connect', function() {
  gulp.watch('dev/sass/**/*.scss', ['css']);
  gulp.watch('dev/js/vendor/*.js', ['vendor-js']);
  gulp.watch(['dev/js/**/*.js', '!dev/js/vendor/*.js'], ['js']);
  gulp.watch('dev/img/**/*.{jpg,jpeg,png,gif,svg,ico}', ['img']);

  livereload.listen();

  gulp.watch(['public/*.html', 'public/js/*.js', 'public/img/**/*.{jpg,jpeg,png,gif,svg,ico}', 'public/css/*.css']).on('change', livereload.changed);

  connect.server({
    root: 'public/',
    port: 8000
  });
});

gulp.task('deploy', function() {
  return gulp.src('public/**/*')
    .pipe(ghpages());
});

gulp.task('default', ['css', 'vendor-js', 'js', 'img', 'connect']);
