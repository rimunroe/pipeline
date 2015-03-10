var errors = require('../errors');

module.exports = function (_app) {
  return function (options) {
    if (options != null) {
      var pluginName = options.name;

      if (pluginName == null) throw new errors.plugin.noName();

      if (typeof options.factories === 'object') {
        var badKeys = _.intersection(_.keys(options.factories), _.keys(_app.create));
        if (!_.isEmpty(badKeys)) {
          throw new errors.plugins.badKeys(pluginName, badKeys);
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
    } else throw new errors.plugins.noPluginObject();
  };
};
