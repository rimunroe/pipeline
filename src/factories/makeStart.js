var _ = require('lodash');

module.exports = function (_app) {

  var _start = function () {
    _app.dispatcher.initialize();
    _.forEach(_app.initializers.stores, function (init){init();});
    delete _app.initializers.stores;
    _.forEach(_app.initializers.adapters, function (init){init();});
    delete _app.initializers.adapters;

    _app.dispatcher.runStoreCallbacks();

    _app.dispatcher.canDispatch = true;

    _.forEach(_app.startHooks, function(hook, pluginName){
      console.log("Running plugin \"" + pluginName + "\"'s start hook");
      hook.call(_app);
    });

    if (_.isFunction(_app.initializers.app)) {
      var _context = {
        stores: _app.stores,
        actions: _app.actions,
        helpers: _app.helpers
      };
      _app.initializers.app.call(_context);
    }
    _app.hasStarted = true;
  };

  return function start () {
    if (!_app.hasStarted) {
      _start();
      delete _app.app.create;
      delete _app.app.load;
      delete _app.app.start;
    } else {
      console.log("App was already started.");
    }
  };
};
