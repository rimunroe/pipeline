var fs = require('fs');
var path = require('path');
var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var shell = require('gulp-shell');
var plumber = require('gulp-plumber');
var notifier = require('node-notifier');

var version = function(){return require('./package.json').version;};

var handleError = function(error){
  var filePath = error.fileName.split(path.sep);
  var file = filePath[filePath.length - 1];
  var line = error.lineNumber;
  var message = '\uD83D\uDCA5  [' + file + ':' + line + ']' + error.message.split(':')[1];

  notifier.notify({message: message});
  console.log('\n' + message + '\n');
  console.log(error.message);
  console.log(error.stack);
  console.log('\n');
};

gulp.task('build', function(){
  var files = [
    './src/setup.js',
    './src/main.js',
    './src/export.js'
  ];

  gulp.src(files)
    .pipe(plumber({errorHandler: handleError}))
    .pipe(concat('pipeline.js'))
    .pipe(gulp.dest('./dist'))
    .pipe(uglify())
    .pipe(rename('pipeline.min.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function() {
  gulp.watch('./src/**/*.js', ['build']);
});

gulp.task('set-npm-version', function() {
  var npmJson = JSON.parse(fs.readFileSync('./npm/package.json'));
  npmJson.version = version();
  fs.writeFileSync('./npm/package.json', JSON.stringify(npmJson, null, 2));
});

gulp.task('copy-npm-javascript', function() {
  gulp.src('dist/*.js')
    .pipe(gulp.dest('./npm'));
});

gulp.task('copy-npm-readme', function() {
  gulp.src('./README.md')
    .pipe(gulp.dest('./npm'));
});

gulp.task('prepare-npm', [
  'set-npm-version',
  'copy-npm-javascript',
  'copy-npm-readme'
]);

gulp.task('set-bower-version', function() {
  var bowerJson = JSON.parse(fs.readFileSync('./bower.json'));
  bowerJson.version = version();
  fs.writeFileSync('./bower.json', JSON.stringify(bowerJson, null, 2));
});

gulp.task('copy-bower-javascript', function() {
  gulp.src('dist/*.js')
    .pipe(gulp.dest('./bower'));
});

gulp.task('prepare-bower', [
  'set-bower-version',
  'copy-bower-javascript'
]);

gulp.task('commit-version-changes', [
  'prepare-npm',
  'prepare-bower'
], shell.task([
  'git add npm/package.json bower.json bower/*.js',
  'git commit -m \'Build version ' + version() + ' of pipeline.\''
]));

gulp.task('release-npm', ['commit-version-changes'], shell.task(['npm publish'], {
  cwd: './npm'
}));

gulp.task('publish', ['release-npm']);

gulp.task('default', ['build']);
