var _makeStart = function (_app) {
  return function start (options) {
    if (!_app.hasStarted) {
      _app.dispatcher.initialize();
      _.forEach(_app.initializers.stores, function (init){init();});
      delete _app.initializers.stores;
      _.forEach(_app.initializers.adapters, function (init){init();});
      delete _app.initializers.adapters;

      _app.dispatcher.runStoreCallbacks();

      _app.dispatcher.canDispatch = true;
      _app.dispatcher.hasStarted = true;

      if ((options != null) && _.isFunction(options.initialize)) {
        var _context = {
          stores: _app.stores,
          actions: _app.actions,
          helpers: _app.helpers
        };

        options.initialize.call(_context);
      }
    }
    delete _app.createAction;
    delete _app.createStore;
    delete _app.createAdapter;
    delete _app.createHelper;
    delete _app.createView;
  };
};
