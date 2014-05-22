var gulp = require('gulp');
var pkg = require('./package.json');

var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var html2js = require('gulp-html2js');
var include = require('gulp-include');
var jshint = require('gulp-jshint');
var less = require('gulp-less');
var karma = require('gulp-karma');

var paths = {
    js: [
        'js/SmartButton.js'
    ]
};

gulp.task('less', function(){
    gulp.src('less/ui-components.less')
        .pipe(less({
            filename: 'ui-components.css'
        }))
        .pipe(gulp.dest('css'));
});

gulp.task('uglify', ['less'], function(){
    gulp.src(paths.js)
        //.pipe(concat(pkg.name+'.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build/test'));
});

gulp.task('watch', function(){
    gulp.watch(paths.js, ['uglify']);
});

gulp.task('default', ['uglify']);
//gulp.task('default', function() {
//    // place code for your default task here
//});