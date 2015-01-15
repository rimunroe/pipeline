(function() {
  var isNode, pipeline, _,
    __indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; },
    __slice = [].slice;

  isNode = typeof window === 'undefined';

  if (isNode) {
    _ = require('lodash');
  } else {
    _ = this._;
  }

  pipeline = {};

  pipeline = {
    createApp: function(options) {
      var canDispatch, dispatcher, hasStarted, _initializers, _keyObj, _sortDependencies;
      _initializers = {
        stores: [],
        adapters: []
      };
      _keyObj = function(array, callback) {
        var key, obj, _i, _len;
        obj = {};
        for (_i = 0, _len = array.length; _i < _len; _i++) {
          key = array[_i];
          obj[key] = callback(key);
        }
        return obj;
      };
      _sortDependencies = function(unsorted) {
        var action, cyclic, sorted, sortedOrder, working, _i, _len;
        sorted = _.filter(unsorted, function(action) {
          return _.isEmpty(action.after);
        });
        if (_.isEmpty(sorted)) {
          return false;
        }
        sortedOrder = _.pluck(sorted, 'storeKey');
        working = _.difference(unsorted, sorted);
        while (!_.isEmpty(working)) {
          cyclic = true;
          for (_i = 0, _len = working.length; _i < _len; _i++) {
            action = working[_i];
            if (!(_.every(action.after, function(dep) {
              return __indexOf.call(sortedOrder, dep) >= 0;
            }))) {
              continue;
            }
            cyclic = false;
            sorted.push(action);
            sortedOrder.push(action.storeKey);
          }
          if (cyclic) {
            return false;
          }
          working = _.difference(working, sorted);
        }
        return sorted;
      };
      canDispatch = false;
      hasStarted = false;
      dispatcher = {
        actionCallbacks: {},
        storeCallbacks: {},
        changedStores: {},
        onAction: function(storeKey, actionKey, after, callback) {
          var missingDependency, sortedCallbacks;
          if (this.actionCallbacks[actionKey] == null) {
            this.actionCallbacks[actionKey] = [];
          }
          if (!_.every(after, (function(_this) {
            return function(dep) {
              return _.find(_this.actionCallbacks[actionKey], function(action) {
                return dep === action.storeKey;
              });
            };
          })(this))) {
            missingDependency = true;
          }
          this.actionCallbacks[actionKey].push({
            storeKey: storeKey,
            after: after || [],
            callback: callback
          });
          if (!missingDependency) {
            sortedCallbacks = _sortDependencies(this.actionCallbacks[actionKey]);
            if (sortedCallbacks === false) {
              this.actionCallbacks[actionKey].pop();
              throw new Error("store \"" + storeKey + "\"'s action \"" + actionKey + "\" creates a circular dependency");
            } else {
              return this.actionCallbacks[actionKey] = sortedCallbacks;
            }
          }
        },
        registerStoreCallback: function(storeKey, adapterKey, callback) {
          var _base;
          if ((_base = this.storeCallbacks)[storeKey] == null) {
            _base[storeKey] = [];
          }
          return this.storeCallbacks[storeKey].push({
            adapterKey: adapterKey,
            callback: callback
          });
        },
        unregisterStoreCallback: function(storeKey, callback) {
          return _.remove(this.storeCallbacks[storeKey], callback);
        },
        storeHasChanged: function(storeKey) {
          return this.changedStores[storeKey] = true;
        },
        sendAction: function(actionKey, payload) {
          var _send;
          _send = (function(_this) {
            return function() {
              var cb, storeKey, val, _i, _j, _len, _len1, _ref, _ref1, _ref2;
              canDispatch = true;
              _this.changedStores = {};
              if (_this.actionCallbacks[actionKey] != null) {
                _ref = _this.actionCallbacks[actionKey];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                  cb = _ref[_i];
                  cb.callback(payload);
                }
              }
              _ref1 = _this.changedStores;
              for (storeKey in _ref1) {
                val = _ref1[storeKey];
                if (_this.storeCallbacks[storeKey] != null) {
                  _ref2 = _this.storeCallbacks[storeKey];
                  for (_j = 0, _len1 = _ref2.length; _j < _len1; _j++) {
                    cb = _ref2[_j];
                    cb.callback();
                  }
                }
              }
              return canDispatch = false;
            };
          })(this);
          if (canDispatch) {
            return _send();
          } else {
            return _.defer(_send);
          }
        },
        runStoreCallbacks: function() {
          var cb, storeKey, val, _ref, _results;
          _ref = this.changedStores;
          _results = [];
          for (storeKey in _ref) {
            val = _ref[storeKey];
            if (this.storeCallbacks[storeKey] != null) {
              _results.push((function() {
                var _i, _len, _ref1, _results1;
                _ref1 = this.storeCallbacks[storeKey];
                _results1 = [];
                for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
                  cb = _ref1[_i];
                  _results1.push(cb.callback());
                }
                return _results1;
              }).call(this));
            }
          }
          return _results;
        }
      };
      return {
        actions: {},
        stores: {},
        createActions: function(actionObject) {
          return _.forEach(actionObject, (function(_this) {
            return function(packager, actionKey) {
              return _this.createAction(actionKey, packager);
            };
          })(this));
        },
        createAction: function(actionKey, packager) {
          return this.actions[actionKey] = (function(_this) {
            return function() {
              var args, payload;
              args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
              payload = packager.apply(null, args);
              return dispatcher.sendAction(actionKey, typeof payload === 'object' ? payload : {});
            };
          })(this);
        },
        createStore: function(key, options) {
          var after, callbacks, data, reservedKeys, store, stores, _context, _initContext, _mutate, _trigger;
          callbacks = [];
          data = {};
          _mutate = function(updates, value) {
            var val, _results;
            if (typeof updates === 'object') {
              _results = [];
              for (key in updates) {
                val = updates[key];
                _results.push(data[key] = val);
              }
              return _results;
            } else if (typeof updates === 'string') {
              return data[updates] = value;
            }
          };
          after = typeof options.after === 'string' ? [options.after] : Array.isArray(options.after) ? options.after : [];
          if (__indexOf.call(after, key) >= 0) {
            throw new Error("store \"" + key + "\" waits for itself");
          }
          reservedKeys = _.intersection(_.keys(options), ['stores', 'key', 'get', 'update']);
          if (!_.isEmpty(reservedKeys)) {
            _.each(reservedKeys, function(reservedKey) {
              throw new Error("In \"" + key + "\" Store: \"" + reservedKey + "\" is a reserved key and cannot be used.");
            });
          }
          _context = _.omit(options, ['initialize', 'api', 'actions']);
          _.each(_context, function(prop, key) {
            if (_.isFunction(prop)) {
              return _context[key] = prop.bind(_context);
            }
          });
          _trigger = function() {
            return dispatcher.storeHasChanged(key);
          };
          _.extend(_context, {
            key: key,
            api: {},
            get: function(key) {
              return _.clone(key != null ? data[key] : data);
            },
            update: function(updates, value) {
              _mutate(updates, value);
              return _trigger();
            }
          });
          stores = this.stores;
          store = {
            get: function(key) {
              return _.cloneDeep(key != null ? data[key] : data);
            }
          };
          _.forEach(options.api, function(callback, name) {
            var cb;
            if (name !== 'get') {
              cb = callback.bind(_context);
              _context.api[name] = cb;
              return store[name] = cb;
            }
          });
          _.forEach(options.actions, function(action, actionKey) {
            var callback, fn, waitFor;
            if (typeof action === 'function') {
              waitFor = after;
              callback = action;
            } else {
              if (key === action.after || __indexOf.call(action.after, key) >= 0) {
                throw new Error("on action \"" + actionKey + "\", store \"" + key + "\" waits for itself to update");
              }
              waitFor = _.unique(after.concat(action.after));
              callback = action.action;
            }
            fn = function(payload) {
              _context.stores = _keyObj(waitFor, function(key) {
                return stores[key];
              });
              return callback.call(_context, payload);
            };
            return dispatcher.onAction(key, actionKey, waitFor, fn);
          });
          if (_.isFunction(options.initialize)) {
            _initContext = _.omit(_context, ['actions', 'update']);
            _initContext.update = _mutate;
            _initializers.stores.push(options.initialize.bind(_initContext));
          }
          this.stores[key] = store;
          return store;
        },
        createAdapter: function(key, options) {
          var callback, name, property, storeKey, _context, _ref, _ref1;
          _context = {
            key: key,
            stores: this.stores,
            actions: this.actions
          };
          _ref = _.omit(options, ['stores', 'initialize']);
          for (name in _ref) {
            property = _ref[name];
            if (_.isFunction(property)) {
              _context[name] = property.bind(_context);
            }
          }
          _ref1 = options.stores;
          for (storeKey in _ref1) {
            callback = _ref1[storeKey];
            dispatcher.registerStoreCallback(storeKey, key, callback.bind(_context));
          }
          if (_.isFunction(options.initialize)) {
            return _initializers.adapters.push(options.initialize.bind(_.omit(_context, 'actions')));
          }
        },
        reactMixin: function(stores) {
          var storeKey, storesObj, _i, _len;
          if (_.isString(stores)) {
            stores = [stores];
          }
          storesObj = {};
          for (_i = 0, _len = stores.length; _i < _len; _i++) {
            storeKey = stores[_i];
            storesObj[storeKey] = this.stores[storeKey];
          }
          return {
            stores: storesObj,
            actions: this.actions,
            componentDidMount: function() {
              var StoreKey, cb, _j, _len1, _results;
              _results = [];
              for (_j = 0, _len1 = stores.length; _j < _len1; _j++) {
                storeKey = stores[_j];
                StoreKey = storeKey.charAt(0).toUpperCase() + storeKey.slice(1);
                cb = this["on" + StoreKey + "Change"];
                if (_.isFunction(cb)) {
                  _results.push(dispatcher.registerStoreCallback(storeKey, 'react-view', cb));
                } else {
                  _results.push(void 0);
                }
              }
              return _results;
            },
            componentWillUnmount: function() {
              var StoreKey, cb, _j, _len1, _results;
              _results = [];
              for (_j = 0, _len1 = stores.length; _j < _len1; _j++) {
                storeKey = stores[_j];
                StoreKey = storeKey.charAt(0).toUpperCase() + storeKey.slice(1);
                cb = this["on" + StoreKey + "Change"];
                if (_.isFunction(cb)) {
                  _results.push(dispatcher.unregisterStoreCallback(storeKey, cb));
                } else {
                  _results.push(void 0);
                }
              }
              return _results;
            }
          };
        },
        start: function() {
          var _context;
          if (!hasStarted) {
            _.each(_initializers.stores, function(init) {
              return init();
            });
            delete _initializers.stores;
            _.each(_initializers.adapters, function(init) {
              return init();
            });
            delete _initializers.adapters;
            dispatcher.runStoreCallbacks();
            canDispatch = true;
            hasStarted = true;
            if ((options != null) && _.isFunction(options.initialize)) {
              _context = {
                stores: this.stores,
                actions: this.actions
              };
              return options.initialize.call(_context);
            }
          }
        }
      };
    }
  };

  if (isNode) {
    module.exports = pipeline;
  } else {
    window.pipeline = pipeline;
  }

}).call(this);
