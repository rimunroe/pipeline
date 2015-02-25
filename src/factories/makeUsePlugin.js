var _makeUsePlugin = function (_app) {
  return function (options) {
    if (options.name == null) throw new Error("Plugin must be named");

    var pluginName = options.name;

    if (options.interface != null) {

      if (typeof options.interface.factories === 'object') {
        var badKeys = _.intersection(_.keys(options.interface.factories, _app.create));
        if (!_.isEmpty(badKeys)) {
          throw new Error("Plugin \"" + pluginName + "\" attempts to overwrite the following keys on app.create: " + badKeys.join(', '));
        }
        var _creators = {};

        _.forEach(options.interface.factories, function(factory, creatorName){
          _.creators[creatorName] = factory.call(null, _app);
        });

        _.extend(_app.create, _creators);
      }

      if (typeof options.interface.startHook === 'function') {
        _app.startHooks[pluginName] = options.interface.startHook;
      }
    }
  };
};
