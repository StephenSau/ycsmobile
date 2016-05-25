'use strict';

var gulp = require('gulp');
var stylish = require('jshint-stylish');
var args = require('get-gulp-args')();
var colors = require('colors');

var $ = require('gulp-load-plugins')();

gulp.task('scripts:util', function(){
	return gulp.src([
			'scripts/lib/main.js',
			'scripts/lib/**/!(main)*.js'
		])
		.pipe($.jshint())
		.pipe($.jshint.reporter(stylish))
		.pipe($.concat('util.js'))
		.pipe($.uglify())
		.pipe(gulp.dest('js'))
		.pipe($.filesize());
});

gulp.task('script:module', function(){
	return gulp.src('scripts/module/*.js')
		.pipe($.jshint())
		.pipe($.jshint.reporter(stylish))
		.pipe(gulp.dest('js/module'))
		.pipe($.filesize());
});

gulp.task('script:pages', function(){
	return gulp.src('scripts/*.js')
		.pipe($.jshint())
		.pipe($.jshint.reporter(stylish))
		.pipe(gulp.dest('js'))
		.pipe($.filesize());
});

gulp.task('script', function(){
	var file =  args.file || 'index';

	console.log('[' + colors.yellow('Modified') + ']', colors.green(file + '.js'));

	return gulp.src('scripts/'+ file +'.js')
		.pipe($.jshint())
		.pipe($.jshint.reporter(stylish))
		.pipe(gulp.dest('js'))
		.pipe($.filesize());
});

gulp.task('script:all', ['scripts:util', 'script:module', 'script:pages']);


gulp.task('html:all', function () {
	return gulp.src('../content/*.html')
		.pipe($.include())
		.on('error', function (err) { console.log(err.message);})
		.pipe(gulp.dest('../app'));
});

// Call with `html --file targetFileName`
gulp.task('html', function () {
	var file =  args.file || 'index';

	console.log('[' + colors.yellow('Modified') + ']', colors.green(file + '.html'));

	return gulp.src('../content/'+ file + '.html')
		.pipe($.include())
		.on('error', function (err) { console.log(err.message);})
		.pipe(gulp.dest('../app'));
});

gulp.task('css:pages', function(){
	return gulp.src([
			'scss/ycsmobile/**/*.scss'
		])
		.pipe($.rubySass({style:'compressed', 'sourcemap=none': true }))
		.on('error', function (err) { console.log(err.message);})
		.pipe(gulp.dest('css'));
});

gulp.task('css:global', function(){
	return gulp.src('scss/ycsglobal.scss')
		.pipe($.rubySass({style:'compressed', 'sourcemap=none': true }))
    .on('error', function (err) { console.log(err.message);})
		.pipe(gulp.dest('css'));
});

// Call with `css --file targetFileName`
gulp.task('css', function(){
	var file =  args.file || 'index';

	console.log('[' + colors.yellow('Modified') + ']', colors.green(file + '.css'));

	return gulp.src('scss/ycsmobile/' + file + '.scss')
		.pipe($.rubySass({style:'compressed', 'sourcemap=none': true }))
    .on('error', function (err) { console.log(err.message);})
		.pipe(gulp.dest('css'));
});

gulp.task('css:common', function(cb){
	$.sequence('css:global', 'css')(cb);
});

gulp.task('css:all', function(cb){
	$.sequence('css:global', 'css:pages')(cb);
});

gulp.task('dev', ['html', 'css:common', 'script']);