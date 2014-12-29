fs = require 'fs'
gulp = require 'gulp'
coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
rename = require 'gulp-rename'
uglify = require 'gulp-uglify'
shell = require 'gulp-shell'

version = -> require('./package.json').version

gulp.task 'build', ->
  files = [
    './src/setup.coffee'
    './src/main.coffee'
    './src/export.coffee'
  ]

  gulp.src(files)
    .pipe concat 'pipeline.js'
    .pipe coffee()
    .pipe gulp.dest './dist'
    .pipe uglify()
    .pipe rename 'pipeline.min.js'
    .pipe gulp.dest './dist'

gulp.task 'watch', ->
  gulp.watch './src/**/*.coffee', ['build']

gulp.task 'set-npm-version', ->
  npmJson = JSON.parse fs.readFileSync './npm/package.json'
  npmJson.version = version()
  fs.writeFileSync './npm/package.json', JSON.stringify npmJson, null, 2

gulp.task 'copy-npm-javascript', ->
  gulp.src 'dist/*.js'
    .pipe gulp.dest './npm'

gulp.task 'prepare-npm', [
  'set-npm-version'
  'copy-npm-javascript'
]

gulp.task 'set-bower-version', ->
  bowerJson = JSON.parse fs.readFileSync './bower.json'
  bowerJson.version = version()
  fs.writeFileSync './bower.json', JSON.stringify bowerJson, null, 2

gulp.task 'copy-bower-javascript', ->
  gulp.src 'dist/*.js'
    .pipe gulp.dest './bower'

gulp.task 'prepare-bower', [
  'set-bower-version'
  'copy-bower-javascript'
]

gulp.task 'commit-version-changes', [
  'prepare-npm'
  'prepare-bower'
], shell.task [
  'git add npm/package.json bower.json bower/*.js'
  'git commit -m \'Build version ' + version() + ' of pipeline.\''
]

gulp.task 'release-npm', ['commit-version-changes'], shell.task(['npm publish'],
  cwd: './npm'
)
gulp.task 'publish', ['release-npm']

gulp.task 'default', ['build']
