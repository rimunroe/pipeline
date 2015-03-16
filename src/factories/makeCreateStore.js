var _ = require('../lib/lodash');

var errors = require('../errors');

module.exports = function (_app) {

  var _keyObj = function(array, callback){
    var obj = {};
    for(var i = 0; i < array.length; i++){
      var key = array[i];
      obj[key] = callback(key);
    }
    return obj;
  };

  return function createStore (storeName, options){
    if (_app.hasStarted) {
      throw new errors.stores.appHasStarted(storeName);
    }
    var data = {};

    var _mutate = function (updates, value){
      if (typeof updates === 'object') {
        for (var key in updates) data[key] = updates[key];
      } else if (typeof updates === 'string') data[updates] = value;
    };

    var after;

    if (typeof options.after === 'string') {
      after = [options.after];
    } else if (Array.isArray(options.after)) {
      after = options.after;
    } else {
      after = [];
    }

    if (after.indexOf(storeName) >= 0) throw new errors.stores.waitingForSelf(storeName);
    var reservedKeys = ['name', 'stores', 'get', 'update'];
    var badKeys = _.intersection(_.keys(options), reservedKeys);

    if (!_.isEmpty(badKeys)) _.each(badKeys, function (badKey) {
      throw new errors.stores.usedBadKeys(storeName, badKey);
    });

    var _context = _.omit(options, ['initialize', 'api', 'actions']);

    _.each(_context, function (prop, key){
      if (_.isFunction(prop)) {
        _context[key] = prop.bind(_context);
      }
    });

    var _trigger = function (){
      _app.dispatcher.storeHasChanged(storeName);
    };

    var availableStores = _keyObj(after, function (key){return _app.stores[key];});

    _.extend(_context, {
      actions: _app.actions,
      name: storeName,
      api: {},
      stores: availableStores,

      get: function (key){
        return _.clone(key != null ? data[key] : data);
      },

      update: function (updates, value){
        _mutate(updates, value);
        _trigger();
      }
    });

    var store = {
      get: function (key) {
        return _.cloneDeep(key != null ? data[key] : data);
      }
    };

    _.forEach(options.api, function (callback, name){
      // todo:  check for colliding public and private methods

      if (_.contains(reservedKeys, name)) {
        throw new errors.stores.usedReservedAPIKey(name);
      }

      var cb = callback.bind(_context);
      _context[name] = cb;
      store[name] = cb;
    });

    _.forEach(options.actions, function (action, actionName){
      var fn = function (){
        action.apply(_context, arguments);
      };

      _app.dispatcher.onAction(storeName, actionName, after, fn);
    });

    if (_.isFunction(options.initialize)) {
      var _initContext = _.omit(_context, ['actions', 'update']);
      _initContext.update = _mutate;
      _app.initializers.stores.push(options.initialize.bind(_initContext));
    }

    if (_app.debug == true || _.contains(_app.debug, storeName)) {
      store._ctx = _context;
    }

    _app.stores[storeName] = store;
    _app.storeContexts[storeName] = _context;
    return store;
  };
};
