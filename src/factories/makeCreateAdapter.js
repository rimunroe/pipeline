var _ = require('../lib/lodash');

module.exports = function (_app) {
  return function createAdapter (adapterName, options) {

    var _adapter = {
      name: adapterName,
      stores: _app.stores,
      actions: _app.actions
    };

    _.forEach(_.omit(options, ['stores', 'initialize']), function (property, name){
      if (_.isFunction(property)) {
        _adapter[name] = property.bind(_adapter);
      } else {
        _adapter[name] = property;
      }
    });

    _.forEach(options.stores, function (callback, storeName){
      _app.dispatcher.registerStoreCallback(storeName, callback.bind(_adapter), adapterName);
    });

    if (_.isFunction(options.initialize)) {
      _app.initializers.adapters.push(options.initialize.bind(_.omit(_adapter, 'actions')));
    }

    _app.adapters[adapterName] = _adapter;

    return _adapter;
  };
};
