pipeline.createApp = function createApp (options) {
  options = options || {};

  var _app = {
    initializers: {
      stores: [],
      adapters: []
    },
    hasStarted: false,
    actions: {},
    stores: {},
    views: {},
    adapters: {},
    helpers: {},
    debug: options.debug
  };

  _app.dispatcher = _createDispatcher(_app);

  var app = {
    createAction: _makeCreateAction(_app),
    createStore: _makeCreateStore(_app),
    createView: _makeCreateView(_app),
    createAdapter: _makeCreateAdapter(_app),
    createHelper: _makeCreateHelper(_app),
    start: _makeStart(_app)
  };

  if (options.debug) {
    app.actions = _app.actions;
    app.views = _app.views;
    app.stores = _app.stores;
    app.adapters = _app.adapters;
    app.helpers = _app.helpers;
    app._dispatcher = _app.dispatcher
    app.info = _createInfo(_app)
  }

  return app;
};
