
'use strict';

var gulp = require('gulp');
var stylish = require('jshint-stylish');

var $ = require('gulp-load-plugins')();

// Pre-Dev JavaScript files

gulp.task('predev:scripts', function(){
	return gulp.src([
			'bower/vue/dist/vue.min.js',
			'bower/vue-async-data/vue-async-data.js',
			'bower/vue-element/vue-element.js',
			'bower/vue-resource/dist/vue-resource.min.js',
			'bower/vue-validator/dist/vue-validator.min.js',
			'bower/vue-touch/vue-touch.min.js',
			'bower/requirejs/require.js',
			'bower/lazyload/build/lazyload.min.js',
			'bower/hammerjs/hammer.min.js'
		])
		.pipe($.uglify({mangle: true}))
		.pipe(gulp.dest('js/vendor'))
		.pipe($.filesize());
});

gulp.task('predev:modernizr', function(){
	return gulp.src('bower/modernizr/modernizr.js')
		.pipe($.uglify())
		.pipe(gulp.dest('js/vendor'))
		.pipe($.filesize());
});

gulp.task('predev:plugin', function(){
	return gulp.src([
		])
		.pipe($.concat('plugin.js'))
		.pipe($.uglify({mangle: true}))
		.pipe(gulp.dest('js'))
		.pipe($.filesize());
});

// Pre-Dev Sass files

gulp.task('predev:scss:bs', function(){
	return gulp.src('bower/bootstrap-sass/assets/stylesheets/**/*.scss')
		.pipe(gulp.dest('scss/bs'))
		.pipe($.filesize());
});

gulp.task('predev:scss:fa', function(){
	return gulp.src('bower/fontawesome/scss/**/*.scss')
		.pipe(gulp.dest('scss/fa'))
		.pipe($.filesize());
});

gulp.task('predev:scss', ['predev:scss:bs', 'predev:scss:fa']);

// Pre-Dev Fonts
gulp.task('predev:fonts', function(){
	return gulp.src([
		'bower/fontawesome/fonts/*',
		'bower/bootstrap-sass/assets/fonts/bootstrap/**'
		])
		.pipe(gulp.dest('fonts'))
		.pipe($.filesize());
});


// Pre-Dev Main Task
gulp.task('predev', ['predev:scripts', 'predev:modernizr', 'predev:plugin', 'predev:scss', 'predev:fonts']);

// Clean Pre-Dev files
gulp.task('predev:clean', function(){
	return gulp.src(
		[
			'js/vendor',
			'js/modernizr.js',
			'js/plugin.js',
			'scss/fa',
			'scss/bs',
			'fonts'
		],	{read: false})
		.pipe($.clean());
});