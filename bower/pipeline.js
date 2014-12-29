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
    createApp: function() {
      var dispatcher, isDispatching, _keyObj, _sortDependencies;
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
      isDispatching = false;
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
              isDispatching = true;
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
              return isDispatching = false;
            };
          })(this);
          if (isDispatching) {
            return _.defer(_send);
          } else {
            return _send();
          }
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
          var after, callbacks, data, reservedKeys, store, stores, _context;
          callbacks = [];
          data = {};
          after = typeof options.after === 'string' ? [options.after] : Array.isArray(options.after) ? options.after : [];
          if (__indexOf.call(after, key) >= 0) {
            throw new Error("store \"" + key + "\" waits for itself");
          }
          reservedKeys = _.intersection(_.keys(options), ['stores', 'key', 'trigger', 'get', 'update']);
          if (!_.isEmpty(reservedKeys)) {
            _.each(reservedKeys, function(reservedKey) {
              throw new Error("In \"" + key + "\" Store: \"" + reservedKey + "\" is a reserved key and cannot be used.");
            });
          }
          _context = _.omit(options, ['api', 'actions']);
          _.each(_context, function(prop, key) {
            if (_.isFunction(prop)) {
              return _context[key] = prop.bind(_context);
            }
          });
          _.extend(_context, {
            key: key,
            api: {},
            trigger: function() {
              return dispatcher.storeHasChanged(this.key);
            },
            get: function(key) {
              return _.clone(key != null ? data[key] : data);
            },
            update: function(updates, value) {
              var val;
              if (typeof updates === 'object') {
                for (key in updates) {
                  val = updates[key];
                  data[key] = val;
                }
              } else if (typeof updates === 'string') {
                data[updates] = value;
              }
              return this.trigger();
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
              _context.action = _.isObject(payload) ? payload : {};
              _context.stores = _keyObj(waitFor, function(key) {
                return stores[key];
              });
              callback.call(_context);
              return _context.action = {};
            };
            return dispatcher.onAction(key, actionKey, waitFor, fn);
          });
          this.stores[key] = store;
          return store;
        },
        createAdapter: function(key, options) {
          var callback, name, property, storeKey, _context, _ref, _results;
          _context = {
            key: key,
            stores: this.stores,
            actions: this.actions
          };
          for (name in options) {
            property = options[name];
            if (name !== 'stores') {
              if (typeof property === 'function') {
                _context[name] = property.bind(_context);
              }
            }
          }
          _ref = options.stores;
          _results = [];
          for (storeKey in _ref) {
            callback = _ref[storeKey];
            _results.push(dispatcher.registerStoreCallback(storeKey, key, callback.bind(_context)));
          }
          return _results;
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
        start: function(appInit) {
          console.log('starting, initializers: ', this.initializers);
          _.each(this.initializers, function(init) {
            return init();
          });
          delete this.initializers;
          if (_.isFunction(appInit)) {
            return appInit.call(this);
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
