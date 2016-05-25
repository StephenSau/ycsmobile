'use strict';

var gulp = require('gulp');
var stylish = require('jshint-stylish');

var $ = require('gulp-load-plugins')();

gulp.task('dist:script', function(){
	return gulp.src('scripts/**/*.js')
		.pipe($.jshint())
		.pipe($.jshint.reporter(stylish))
		.pipe($.uglify({mangle: true}))
		.pipe(gulp.dest('js'))
		.pipe($.filesize());
});

// Distribution for QA

gulp.task('qa', ['dist:script', 'css:all', 'html:all']);