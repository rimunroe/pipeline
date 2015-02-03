pipeline._makeCreateAdapter = function (_app) {
  return function createAdapter (adapterName, options) {
    var _context = {
      adapterName: adapterName,
      stores: _app.stores,
      actions: _app.actions
    };

    _.forEach(_.omit(options, ['stores', 'initialize']), function (property, name){
      if (_.isFunction(property)) {
        _context[name] = property.bind(_context);
      }
    });

    _.forEach(options.stores, function (callback, storeName){
      _app.dispatcher.registerStoreCallback(storeName, adapterName, callback.bind(_context));
    });

    if (_.isFunction(options.initialize)) {
      _app.initializers.adapters.push(options.initialize.bind(_.omit(_context, 'actions')));
    }
  };
};
