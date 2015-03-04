# Changelog

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
