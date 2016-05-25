'use strict';

var gulp = require('gulp');
var sequence = require('gulp-sequence');

var $ = require('gulp-load-plugins')();

gulp.task('clean', function(){
	return gulp.src(
		['.dist'],	{read: false})
		.pipe($.clean());
});

gulp.task('deepclean', function(){
	return gulp.src(
		['.development', '.dist', 'zip'],	{read: false})
		.pipe($.clean());
});

gulp.task('watch', ['dev'], function(){
	gulp.watch('scripts/*', ['script']);
	gulp.watch('scripts/module/*', ['script:module']);
  gulp.watch('scripts/lib/**/*.js', ['scripts:util']);
	gulp.watch('scss/*.scss', ['css:global']);
	gulp.watch('scss/ycsmobile/**/*.scss', ['css:common']);
	gulp.watch('../content/*.html', ['html']);
	gulp.watch('../tpl/*.html', ['html']);
});