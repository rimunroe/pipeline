# Changelog

## 0.1.2 - 2015-03-11

- Fixed the lodash dependency of the built version

## 0.1.1 - 2015-03-10

- Removed lodash from pipeline.js
- Corrected package.json to point at the correct file for CommonJS loading
- If a dependended-on store does not listen to an action a depending store lists a callback for, the dispatcher will no longer throw a fit

## 0.1.0 - 2015-03-09

- Changed the way validators work to follow discussion of issue #13
- Store callbacks work now regardless of declaration order
- Some improvements to testing and the build stack

## 0.0.6 - 2015-03-04

- Fixed store resolution order
- Added plugin support
- Removed action packager functions and replaced with validators

## 0.0.5 - 2015-01-21

- Removed CoffeeScript from project
- `gulp watch` will no longer crash constantly on syntax errors
- Better notifier messages for build errors
- Added some test coverage (`npm test` to run)
- New actions will now be sent synchronously instead of asynchronously if dispatch is already in progress
- Stores and actions can no longer be created after the app has started
- Fixed store `update` method so that updating a single value works properly

## 0.0.4 - 2015-01-15

- Added changelog
- Rewrote README
- Added API documentation
- Added optional options argument to pipeline.createApp
- Fixed missing initialization functionality
