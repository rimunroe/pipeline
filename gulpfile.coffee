fs = require 'fs'
gulp = require 'gulp'
coffee = require 'gulp-coffee'
concat = require 'gulp-concat'
rename = require 'gulp-rename'
uglify = require 'gulp-uglify'
shell = require 'gulp-shell'
prepend = require('gulp-insert').prepend

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

gulp.task 'set-gem-version', ->
  gemVersionModule = "module pipeline\n  VERSION = '" + version() + "'\nend"
  fs.writeFileSync './rails/lib/pipeline/version.rb', gemVersionModule

gulp.task 'copy-gem-javascript', ->
  depsHeader = '//= require lodash\n\n'
  gulp.src 'dist/*.js'
    .pipe prepend depsHeader
    .pipe gulp.dest './rails/app/assets/javascripts'

gulp.task 'copy-gem-metafiles', ->
  gulp.src([
    'LICENSE.txt'
    'README.md'
  ]).pipe gulp.dest './rails'

gulp.task 'prepare-gem', [
  'set-gem-version'
  'copy-gem-javascript'
  'copy-gem-metafiles'
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

gulp.task "commit-version-changes", [
  "prepare-npm"
  "prepare-gem"
  "prepare-bower"
], shell.task [
  "git add npm/package.json rails/lib/pipeline/version.rb bower.json bower/*.js"
  "git commit -m \"Build version " + version() + " of pipeline.\""
]

gulp.task "release-gem", ["commit-version-changes"], shell.task([
  "rake build"
  "rake release"
],
  cwd: "./rails"
)

gulp.task "release-npm", ["release-gem"], shell.task(["npm publish"],
  cwd: "./npm"
)
gulp.task "publish", ["release-npm"]
