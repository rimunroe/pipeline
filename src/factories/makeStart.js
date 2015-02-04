var _makeStart = function (_app) {

  var _start = function (options) {
    _app.dispatcher.initialize();
    _.forEach(_app.initializers.stores, function (init){init();});
    delete _app.initializers.stores;
    _.forEach(_app.initializers.adapters, function (init){init();});
    delete _app.initializers.adapters;

    _app.dispatcher.runStoreCallbacks();

    _app.dispatcher.canDispatch = true;

    if ((options != null) && _.isFunction(options.initialize)) {
      var _context = {
        stores: _app.stores,
        actions: _app.actions,
        helpers: _app.helpers
      };
      options.initialize.call(_context);
    }
    _app.hasStarted = true;
  };

  return function start (options) {
    if (!_app.hasStarted) {
      _start(options);
      delete _app.app.create;
      delete _app.app.load;
      delete _app.app.start;
    } else {
      console.log("App '" + _app.appName + "' was already started.");
    }
  };
};
