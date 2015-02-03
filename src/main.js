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
    createAction: pipeline._makeCreateAction(_app),
    createStore: pipeline._makeCreateStore(_app),
    createView: pipeline._makeCreateView(_app),
    createAdapter: pipeline._makeCreateAdapter(_app),
    createHelper: pipeline._makeCreateHelper(_app),
    start: pipeline._makeStart(_app)
  };

  if (options.debug) {
    app.actions = _app.actions;
    app.views = _app.views;
    app.stores = _app.stores;
    app.adapters = _app.adapters;
    app.helpers = _app.helpers;
    app._dispatcher = _app.dispatcher
  }

  return app;
};
