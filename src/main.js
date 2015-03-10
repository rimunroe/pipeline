var _ = require('lodash');

var errors = require('./errors');

var _createStatus = require('./factories/createStatus');
var _createLoad = require('./factories/createLoad');
var _makeCreateAction = require('./factories/makeCreateAction');
var _makeCreateStore = require('./factories/makeCreateStore');
var _makeCreateAdapter = require('./factories/makeCreateAdapter');
var _makeCreateHelper = require('./factories/makeCreateHelper');
var _makeUsePlugin = require('./factories/makeUsePlugin');
var _makeStart = require('./factories/makeStart');
var _createDispatcher = require('./factories/createDispatcher');

var _handleMany = require('./helpers/handleMany');

module.exports = {
  createApp: function (options) {
    options = options || {};

    var _app = {
      initializers: {
        stores: [],
        adapters: []
      },
      startHooks: {},
      hasStarted: false,
      actions: {},
      stores: {},
      storeContexts: {},
      adapters: {},
      helpers: {},
      plugins: {},
      debug: options.debug
    };

    _app.usePlugin  = _makeUsePlugin(_app);

    _app.status = _createStatus(_app);

    _app.load = _createLoad(_app);

    var createAction = _makeCreateAction(_app);
    var createStore = _makeCreateStore(_app);
    var createAdapter = _makeCreateAdapter(_app);
    var createHelper = _makeCreateHelper(_app);

    _app.create = {
      action: createAction,
      actions: _handleMany(createAction),
      store: createStore,
      stores: _handleMany(createStore),
      adapter: createAdapter,
      adapters: _handleMany(createAdapter),
      helper: createHelper,
      helpers: _handleMany(createHelper)
    };

    if (_.isFunction(options.initialize)) {
      _app.initializers.app = options.initialize;
    }

    _app.start = _makeStart(_app);

    _app.dispatcher = _createDispatcher(_app);

    if (options.plugins != null){
      if (_.isArray(options.plugins)){
        _.forEach(options.plugins, function(plugin){
          _app.usePlugin(plugin);
        });
      } else if (_.isObject(options.plugins)){
        _app.usePlugin(options.plugins);
      } else {
        throw new errors.badPluginsList();
      }
    }

    var app = _.omit(_app, ['dispatcher', 'debug', 'initializers', 'hasStarted', 'status', 'dispatcher', 'storeContexts']);

    _app.app = app;

    if (options.debug) {
      app._ctx = _app;
    }

    return app;
  }
};
