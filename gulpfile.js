var gulp = require('gulp');
var mocha = require('gulp-mocha');
var plumber = require('gulp-plumber');

gulp.task('test', function(){
  gulp.src('./test/main.test.js', {read: false})
    .pipe(plumber())
    .pipe(mocha());
});

gulp.task('watch', ['test'], function(){
  gulp.watch('./build/pipeline.js', ['test']);
});
