var _makeCreateStore = function (_app) {
  return function createStore (storeName, options){
    if (_app.hasStarted) {
      throw new Error("cannot create new store \"" + storeName + "\". App has already started.");
    }
    var data = {};

    var _mutate = function (updates, value){
      if (typeof updates === 'object') {
        for (var key in updates) data[key] = updates[key];
      } else if (typeof updates === 'string') {
        data[updates] = value;
      }
    };

    var after;

    if (typeof options.after === 'string') {
      after = [options.after];
    } else if (Array.isArray(options.after)) {
      after = options.after;
    } else {
      after = [];
    }

    if (after.indexOf(storeName) >= 0) {
      throw new Error("store \"" + storeName + "\" waits for itself");
    }

    var reservedKeys = _.intersection(_.keys(options), ['storeName', 'stores', 'get', 'update']);

    if (!_.isEmpty(reservedKeys)) _.each(reservedKeys, function (reservedKey) {
      throw new Error("In \"" + storeName + "\" Store: \"" + reservedKey + "\" is a reserved key and cannot be used.");
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

    _.extend(_context, {
      actions: _app.actions,
      storeName: storeName,
      api: {},
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
        _getRef(data, key)
        return _.cloneDeep(key != null ? data[key] : data);
      }
    };

    _.forEach(options.api, function (callback, methodName){
      // todo:  check for colliding public and private methods
      if (name !== 'get') {
        var cb = callback.bind(_context);
        _context[methodNme] = cb;
        store[methodName] = cb;
      }
    });

    _.forEach(options.actions, function (action, actionName){
      var waitFor;
      var callback;

      if (typeof action === 'function'){
        waitFor = after;
        callback = action;
      } else {
        if ((key === action.after) || (action.after.indexOf(key) >= 0)){
          throw new Error("on action \"" + actionName + "\", store \"" + key + "\" waits for itself to update");
        }
        waitFor = _.unique(after.concat(action.after));
        callback = action.action;
      }

      var fn = function (payload){
        stores = _keyObj(waitFor, function (key){return _app.stores[key];});
        callback.call(_context, payload, stores);
      };

      _app.dispatcher.onAction(storeName, actionName, waitFor, fn);
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
    _app.storeContexts[storeName] = _context
    return store;
  };
};
