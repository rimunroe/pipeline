var pipeline = {
  createApp: function(options){
    var _initializers = {
      stores: [],
      adapters: []
    };

    var _keyObj = function(array, callback){
      var obj = {};
      for(var i = 0; i < array.length; i++){
        var key = array[i];
        obj[key] = callback(key);
      }
      return obj;
    };

    var _sortDependencies = function(unsorted){
      var sorted = _.filter(unsorted, function(action){return _.isEmpty(action.after);});
      if (_.isEmpty(sorted)) return false;
      var sortedOrder = _.pluck(sorted, 'storeKey');
      var working = _.difference(unsorted, sorted);

      while(!_.isEmpty(working)){
        var cyclic = true;

        working.forEach(function(action){
          if(_.every(action.after, function(dep){return sortedOrder.indexOf(dep) >= 0;})){
            cyclic = false;
            sorted.push(action);
            sortedOrder.push(action.storeKey);
          }
        });

        if(cyclic) return false;

        working = _.difference(working, sorted);
      }

      return sorted;
    };

    var canDispatch = false;
    var hasStarted = false;
    var actionQueue = [];

    var dispatcher = {
      actionCallbacks: {},
      storeCallbacks: {},
      changedStores: {},

      onAction: function(storeKey, actionKey, after, callback){
        var that = this;
        if(this.actionCallbacks[actionKey] == null) this.actionCallbacks[actionKey] = [];
        var missingDependency = !_.every(after, function(dep) {
          return _.find(that.actionCallbacks[actionKey], function(action) {
            return dep === action.storeKey;
          });
        });

        this.actionCallbacks[actionKey].push({
          storeKey: storeKey,
          after: after || [],
          callback: callback
        });

        if(!missingDependency){
          var sortedCallbacks = _sortDependencies(this.actionCallbacks[actionKey]);
          if(sortedCallbacks === false){
            this.actionCallbacks[actionKey].pop();
            throw new Error("store \"" + storeKey + "\"'s action \"" + actionKey + "\" creates a circular dependency");
          } else {
            this.actionCallbacks[actionKey] = sortedCallbacks;
          }
        }
      },

      registerStoreCallback: function(storeKey, adapterKey, callback){
        if(this.storeCallbacks[storeKey] == null) this.storeCallbacks[storeKey] = [];
        this.storeCallbacks[storeKey].push({
          adapterKey: adapterKey,
          callback: callback
        });
      },

      unregisterStoreCallback: function(storeKey, callback){
        _.remove(this.storeCallbacks[storeKey], callback);
      },

      storeHasChanged: function(storeKey){
        this.changedStores[storeKey] = true;
      },

      dispatchAction: function(actionKey, payload){
        if (this.actionCallbacks[actionKey] != null) {
          _.forEach(this.actionCallbacks[actionKey], function(cb){
            cb.callback(payload);
          });
        }
        for (var storeKey in this.changedStores) {
          if (this.storeCallbacks[storeKey] != null) {
            _.forEach(this.storeCallbacks[storeKey], function(cb){
              cb.callback();
            });
          }
        }
      },

      dispatchActions: function(){
        canDispatch = false;

        var that = this;

        for (var offset = 0; offset < actionQueue.length; offset++) {
          var actionKey = actionQueue[offset].actionKey;
          var payload = actionQueue[offset].payload;

          this.dispatchAction(actionKey, payload);
        }

        actionQueue = [];
        canDispatch = true;
      },

      enqueueAction: function(actionKey, payload){
        actionQueue.push({
          actionKey: actionKey,
          payload: payload
        });
        if (canDispatch) this.dispatchActions();
      },

      runStoreCallbacks: function(){
        for (var storeKey in this.changedStores) {
          if (this.storeCallbacks[storeKey] != null) {
            for (var cb in this.storeCallbacks[storeKey]) cb.callback();
          }
        }
      }
    };

    return {
      actions: {},
      stores: {},

      createActions: function(actionObject){
        var that = this;
        _.forEach(actionObject, function(packager, actionKey){
          that.createAction(actionKey, packager);
        });
      },

      createAction: function(actionKey, packager){
        var that = this;
        this.actions[actionKey] = function(){
          var payload = packager.apply(null, arguments);
          dispatcher.enqueueAction(actionKey, typeof payload === 'object' ? payload : {});
        };
      },

      createStore: function(key, options){
        var callbacks = [];
        var data = {};

        var _mutate = function(updates, value){
          if (typeof updates === 'object') {
            for (var key in updates) data[key] = updates[key];
          } else if (typeof update === 'string') data[updates] = value;
        };

        var after;

        if (typeof options.after === 'string') {
          after = [options.after];
        } else if (Array.isArray(options.after)) {
          after = options.after;
        } else {
          after = [];
        }

        if (after.indexOf(key) >= 0) throw new Error("store \"" + key + "\" waits for itself");

        var reservedKeys = _.intersection(_.keys(options), ['stores', 'key', 'get', 'update']);

        if (!_.isEmpty(reservedKeys)) _.each(reservedKeys, function(reservedKey) {
          throw new Error("In \"" + key + "\" Store: \"" + reservedKey + "\" is a reserved key and cannot be used.");
        });

        var _context = _.omit(options, ['initialize', 'api', 'actions']);

        _.each(_context, function(prop, key){
          if (_.isFunction(prop)) _context[key] = prop.bind(_context);
        });

        var _trigger = function(){
          dispatcher.storeHasChanged(key);
        };

        _.extend(_context, {
          key: key,
          api: {},
          get: function(key){
            return _.clone(key != null ? data[key] : data);
          },
          update: function(updates, value){
            _mutate(updates, value);
            _trigger();
          }
        });

        var stores = this.stores

        var store = {
          get: function(key){
            return _.cloneDeep(key != null ? data[key] : data);
          }
        };

        _.forEach(options.api, function(callback, name){
          if (name !== 'get') {
            var cb = callback.bind(_context);
            _context.api[name] = cb;
            store[name] = cb;
          }
        });

        _.forEach(options.actions, function(action, actionKey){
          var waitFor;
          var callback;

          if (typeof action === 'function'){
            waitFor = after;
            callback = action;
          } else {
            if ((key === action.after) || (action.after.indexOf(key) >= 0)){
              throw new Error("on action \"" + actionKey + "\", store \"" + key + "\" waits for itself to update");
            }
            waitFor = _.unique(after.concat(action.after));
            callback = action.action;
          }

          var fn = function(payload){
            _context.stores = _keyObj(waitFor, function(key){return stores[key];});
            callback.call(_context, payload);
          };

          dispatcher.onAction(key, actionKey, waitFor, fn);
        });

        if (_.isFunction(options.initialize)) {
          var _initContext = _.omit(_context, ['actions', 'update']);
          _initContext.update = _mutate;
          _initializers.stores.push(options.initialize.bind(_initContext));
        }

        this.stores[key] = store;
        return store;
      },

      createAdapter: function(key, options){
        var _context = {
          key: key,
          stores: this.stores,
          actions: this.actions
        };

        _.forEach(_.omit(options, ['stores', 'initialize']), function(property, name){
          if (_.isFunction(property)) _context[name] = property.bind(_context);
        });

        _.forEach(options.stores, function(callback, storeKey){
          dispatcher.registerStoreCallback(storeKey, key, callback.bind(_context));
        });

        if (_.isFunction(options.initialize)) {
          _initializers.adapters.push(options.initialize.bind(_.omit(_context, 'actions')));
        }
      },

      reactMixin: function(stores) {
        if (_.isString(stores)) stores = [stores];

        storesObj = {};

        for (var i = 0; i < stores.length; i++) {
          var storeKey = stores[i];
          storesObj[storeKey] = this.stores[storeKey];
        }
        return {
          stores: storesObj,
          actions: this.actions,

          componentDidMount: function() {
            for (var i = 0; i < stores.length; i++) {
              var storeKey = stores[i];
              StoreKey = storeKey.charAt(0).toUpperCase() + storeKey.slice(1);
              cb = this["on" + StoreKey + "Change"];
              if (_.isFunction(cb)) dispatcher.registerStoreCallback(storeKey, 'react-view', cb);
            }
          },
          componentWillUnmount: function() {
            for (var i = 0; i < stores.length; i++) {
              var storeKey = stores[i];
              StoreKey = storeKey.charAt(0).toUpperCase() + storeKey.slice(1);
              cb = this["on" + StoreKey + "Change"];
              if (_.isFunction(cb)) dispatcher.unregisterStoreCallback(storeKey, cb);
            }
          }
        };
      },

      start: function(){
        if (!hasStarted) {
          _.forEach(_initializers.stores, function(init){init();});
          delete _initializers.stores;
          _.forEach(_initializers.adapters, function(init){init();});
          delete _initializers.adapters;

          dispatcher.runStoreCallbacks();

          canDispatch = true;
          hasStarted = true;

          if ((options != null) && _.isFunction(options.initialize)) {
            var _context = {
              stores: this.stores,
              actions: this.actions
            };

            options.initialize.call(_context);
          }
        }
      }
    };
  }
};
