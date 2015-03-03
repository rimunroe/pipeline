var _makeUsePlugin = function (_app) {
  return function (name, options) {
    if (name == null) throw new Error("Plugin must be named");

    if (options != null) {

      if (typeof options.factories === 'object') {
        var badKeys = _.intersection(_.keys(options.factories, _app.create));
        if (!_.isEmpty(badKeys)) {
          throw new Error("Plugin \"" + pluginName + "\" attempts to overwrite the following keys on app.create: " + badKeys.join(', '));
        }
        var _creators = {};

        _.forEach(options.factories, function(factory, creatorName){
          creators[creatorName] = factory.call(null, _app);
        });

        _.extend(_app.create, _creators);
      }

      if (typeof options.startHook === 'function') {
        _app.startHooks[pluginName] = options.startHook;
      }
    }
  };
};
