module.exports = function (_app) {
  return function (options) {
    if (options != null) {
      var pluginName = options.name;

      if (pluginName == null) throw new Error("Plugin must be named");

      if (typeof options.factories === 'object') {
        var badKeys = _.intersection(_.keys(options.factories), _.keys(_app.create));
        if (!_.isEmpty(badKeys)) {
          throw new Error("Plugin \"" + pluginName + "\" attempts to overwrite the following keys on app.create: " + badKeys.join(', '));
        }
        var _creators = {};

        _.forEach(options.factories, function(factory, creatorName){
          _creators[creatorName] = factory.call(null, _app);
        });

        _.extend(_app.create, _creators);
      }

      if (typeof options.startHook === 'function') {
        _app.startHooks[pluginName] = options.startHook;
      }
    } else throw new Error("No plugin object supplied.");
  };
};
