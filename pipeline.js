(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("_"));
	else if(typeof define === 'function' && define.amd)
		define(["_"], factory);
	else if(typeof exports === 'object')
		exports["pipeline"] = factory(require("_"));
	else
		root["pipeline"] = factory(root["_"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_1__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1);

	var errors = __webpack_require__(2);

	var _createStatus = __webpack_require__(3);
	var _createLoad = __webpack_require__(4);
	var _makeCreateAction = __webpack_require__(5);
	var _makeCreateStore = __webpack_require__(6);
	var _makeCreateAdapter = __webpack_require__(7);
	var _makeCreateHelper = __webpack_require__(8);
	var _makeUsePlugin = __webpack_require__(9);
	var _makeStart = __webpack_require__(10);
	var _createDispatcher = __webpack_require__(11);

	var _handleMany = __webpack_require__(12);

	module.exports = {
	  createApp: function (options) {
	    options = options || {};

	    var _app = {
	      initializers: {
	        stores: [],
	        adapters: []
	      },
	      startHooks: {},
	      hasStarted: false,
	      actions: {},
	      stores: {},
	      storeContexts: {},
	      adapters: {},
	      helpers: {},
	      plugins: {},
	      debug: options.debug
	    };

	    _app.usePlugin  = _makeUsePlugin(_app);

	    _app.status = _createStatus(_app);

	    _app.load = _createLoad(_app);

	    var createAction = _makeCreateAction(_app);
	    var createStore = _makeCreateStore(_app);
	    var createAdapter = _makeCreateAdapter(_app);
	    var createHelper = _makeCreateHelper(_app);

	    _app.create = {
	      action: createAction,
	      actions: _handleMany(createAction),
	      store: createStore,
	      stores: _handleMany(createStore),
	      adapter: createAdapter,
	      adapters: _handleMany(createAdapter),
	      helper: createHelper,
	      helpers: _handleMany(createHelper)
	    };

	    if (_.isFunction(options.initialize)) {
	      _app.initializers.app = options.initialize;
	    }

	    _app.start = _makeStart(_app);

	    _app.dispatcher = _createDispatcher(_app);

	    if (options.plugins != null){
	      if (_.isArray(options.plugins)){
	        _.forEach(options.plugins, function(plugin){
	          _app.usePlugin(plugin);
	        });
	      } else if (_.isObject(options.plugins)){
	        _app.usePlugin(options.plugins);
	      } else {
	        throw new errors.badPluginsList();
	      }
	    }

	    var app = _.omit(_app, ['dispatcher', 'debug', 'initializers', 'hasStarted', 'status', 'dispatcher', 'storeContexts']);

	    _app.app = app;

	    if (options.debug) {
	      app._ctx = _app;
	    }

	    return app;
	  }
	};


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_1__;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	function BadPluginsList(){
	  this.message = '"plugins" must be an array or an object.';
	  var err = new Error();
	  this.stack = err.stack;
	}

	BadPluginsList.prototype = Object.create(Error.prototype);
	BadPluginsList.prototype.name = 'Bad Plugins List';

	function NoPluginName(){
	  this.message = 'Plugin must be named.';
	  var err = new Error();
	  this.stack = err.stack;
	}

	NoPluginName.prototype = Object.create(Error.prototype);
	NoPluginName.prototype.name = 'No Plugin Name';

	function BadPluginKey(pluginName, badKeys){
	  this.message = 'Plugin \"' + pluginName + '\" attempts to overwrite the following keys on app.create: ' + badKeys.join(', ') + '.';
	  var err = new Error();
	  this.stack = err.stack;
	}

	BadPluginKey.prototype = Object.create(Error.prototype);
	BadPluginKey.prototype.name = 'Bad Plugin Key';

	function NoPluginObject(){
	  this.message = 'No plugin object supplied.';
	  var err = new Error();
	  this.stack = err.stack;
	}

	NoPluginObject.prototype = Object.create(Error.prototype);
	NoPluginObject.prototype.name = 'No Plugin Object';

	function MissingDependency(actionName){
	  this.message = 'Missing dependency for action \"' + actionName + '\".';
	  var err = new Error();
	  this.stack = err.stack;
	}

	MissingDependency.prototype = Object.create(Error.prototype);
	MissingDependency.prototype.name = 'Missing Dependency';

	function CyclicDependency(){
	  this.message = 'There is a cyclic dependency in your app.';
	  var err = new Error();
	  this.stack = err.stack;
	}

	CyclicDependency.prototype = Object.create(Error.prototype);
	CyclicDependency.prototype.name = 'Cyclic Dependency';

	function ActionCreatedPostAppStart(actionName){
	  this.message = 'Cannot create new action \"' + actionName + '\". App has already started.';
	  var err = new Error();
	  this.stack = err.stack;
	}

	ActionCreatedPostAppStart.prototype = Object.create(Error.prototype);
	ActionCreatedPostAppStart.prototype.name = 'Action Created Post App Start';

	function ActionValidationFailure(actionName){
	  this.message = 'Invalid values passed to action \"' + actionName + '\". Aborting dispatch.';
	  var err = new Error();
	  this.stack = err.stack;
	}

	ActionValidationFailure.prototype = Object.create(Error.prototype);
	ActionValidationFailure.prototype.name = 'Action Validation Failure';

	function StoreCreatedPostAppStart(storeName){
	  this.message = 'Cannot create new store \"' + storeName + '\". App has already started.';
	  var err = new Error();
	  this.stack = err.stack;
	}

	StoreCreatedPostAppStart.prototype = Object.create(Error.prototype);
	StoreCreatedPostAppStart.prototype.name = 'Store Created Post-App Start';

	function SelfWaitingStore(storeName){
	  this.message = 'Store \"' + storeName + '\" waits for itself.';
	  var err = new Error();
	  this.stack = err.stack;
	}

	SelfWaitingStore.prototype = Object.create(Error.prototype);
	SelfWaitingStore.prototype.name = 'Self Waiting Store';

	function StoreUsedBadKeys(storeName, badKey){
	  this.message = 'In \"' + storeName + '\" Store: \"' + badKey + '\" is a reserved key and cannot be used.';
	  var err = new Error();
	  this.stack = err.stack;
	}

	StoreUsedBadKeys.prototype = Object.create(Error.prototype);
	StoreUsedBadKeys.prototype.name = 'Store Used Bad Keys';

	function StoreUsedReservedAPIKey(name){
	  this.message = 'API key \"' + name + '\" is a reserved key and cannot be used.';
	  var err = new Error();
	  this.stack = err.stack;
	}

	StoreUsedReservedAPIKey.prototype = Object.create(Error.prototype);
	StoreUsedReservedAPIKey.prototype.name = 'Store Used Reserved API Key';

	module.exports = {
	  main: {
	    badPluginsList: BadPluginsList
	  },
	  plugins: {
	    noName: NoPluginName,
	    badKeys: BadPluginKey,
	    noPluginObject: NoPluginObject
	  },
	  dispatcher: {
	    missingDependency: MissingDependency,
	    cyclicDependency: CyclicDependency
	  },
	  actions: {
	    appHasStarted: ActionCreatedPostAppStart,
	    failedValidation: ActionValidationFailure
	  },
	  stores: {
	    appHasStarted: StoreCreatedPostAppStart,
	    waitingForSelf: SelfWaitingStore,
	    usedBadKeys: StoreUsedBadKeys,
	    usedReservedAPIKey: StoreUsedReservedAPIKey
	  }
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1);

	module.exports = function (_app) {

	  var _status = function _status (item) {
	    if (item === 'stores') {
	      console.log(stores);
	    } else if (item === 'dispatcher') {
	      console.log(_app.dispatcher);
	    }
	  };

	  return function status (){
	    var args = (arguments.length >= 1) ? [].prototype.slice.call(arguments) : [];
	    _.each(args, _status);
	  };
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1);

	module.exports = function (_app) {
	  return function (imports) {
	    _.each(imports, function (val, key) {
	      if (key === 'helpers') {
	        _app.createHelpers(val);
	      } else if (key === 'views') {
	        _app.createViews(val);
	      } else if (key === 'stores') {
	        _app.createStores(val);
	      } else if (key === 'adapters') {
	        _app.createAdapters(val);
	      } else if (key === 'actions') {
	        _app.createActions(val);
	      } else {
	        console.log("Load Error:  Unknown key '" + key + "' with value of: " + val,
	          " Top level keys should be 'helpers', 'views', 'stores', 'adapters' or 'actions'."
	        );
	      }
	    });
	  };
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1);

	var errors = __webpack_require__(2);

	module.exports = function (_app) {

	  return function createAction (actionName, validator) {
	    if (_app.hasStarted) {
	      throw new errors.actions.appHasStarted(actionName);
	    }

	    var action = function () {
	      var valid = true;
	      var validatorMessages = [];

	      if (_.isFunction(validator)) {
	        var _context = {
	          require: function(isValidArgument, message) {
	            if (!isValidArgument){
	              valid = false;
	              if (message != null) validatorMessages.push(message);
	            }
	          }
	        };
	        validator.apply(_context, arguments);
	      }

	      if (!valid) {
	        _.forEach(validatorMessages, function(message){
	          console.log(message);
	        });
	        throw new errors.actions.failedValidation(actionName);
	      } else {
	        _app.dispatcher.enqueueAction(actionName, arguments);
	      }
	    };

	    action.actionName = actionName;

	    _app.actions[actionName] = action;

	    return action;

	  };
	};


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1);

	var errors = __webpack_require__(2);

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


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1);

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


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1);

	module.exports = function (_app) {
	  return function createHelper (helperName, fxn) {
	    if (_app.hasStarted) {
	      throw new Error("cannot create new helper \"" + helperName + "\". App has already started.");
	    }

	    var _context = {
	      helpers: _app.helpers
	    };

	    var helper = function (){
	      fxn.apply(_context, arguments);
	    };

	    helper.name = helperName;

	    var keys = helperName.split('.');
	    var slot = _app.helpers;
	    var namespaces = keys.slice(0, -1);
	    var lastKey = keys.slice(-1)[0];

	    _.each(namespaces, function (key) {
	      if (!slot[key]) {
	        slot[key] = {};
	      }
	      slot = slot[key];
	    });

	    slot[lastKey] = helper;

	    return helper;

	  };
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var errors = __webpack_require__(2);

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


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1);

	module.exports = function (_app) {

	  var _start = function () {
	    _app.dispatcher.initialize();
	    _.forEach(_app.initializers.stores, function (init){init();});
	    delete _app.initializers.stores;
	    _.forEach(_app.initializers.adapters, function (init){init();});
	    delete _app.initializers.adapters;

	    _app.dispatcher.runStoreCallbacks();

	    _app.dispatcher.canDispatch = true;

	    _.forEach(_app.startHooks, function(hook, pluginName){
	      console.log("Running plugin \"" + pluginName + "\"'s start hook");
	      hook.call(null, _app);
	    });

	    if (_.isFunction(_app.initializers.app)) {
	      var _context = {
	        stores: _app.stores,
	        actions: _app.actions,
	        helpers: _app.helpers
	      };
	      _app.initializers.app.call(_context);
	    }
	    _app.hasStarted = true;
	  };

	  return function start () {
	    if (!_app.hasStarted) {
	      _start();
	      delete _app.app.create;
	      delete _app.app.load;
	      delete _app.app.start;
	    } else {
	      console.log("App was already started.");
	    }
	  };
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1);

	var errors = __webpack_require__(2);

	module.exports = function (_app) {

	  var _dispatcher = {
	    canDispatch: false,
	    actionQueue: [],
	    actionCallbacks: {},
	    storeCallbacks: {},
	    changedStores: {},
	  };

	  _.extend(_dispatcher, {
	    initialize: function(){
	      _.forEach(_app.storeContexts, function(context, storeName){
	        if (context.stores != null) {
	          _.forEach(context.stores, function(store, name){
	            if (store == null) context.stores[name] = _app.stores[name];
	          });
	        }
	      });

	      for (var actionName in _dispatcher.actionCallbacks){
	        _sortDependencies(actionName);
	      }

	      // TODO make this section WAY less terrible.

	      function _sortDependencies(actionName){
	        var unsorted = _dispatcher.actionCallbacks[actionName];
	        var unlisteningDependencies = [];
	        _.forEach(unsorted, function(action){
	          _.forEach(action.after, function(storeName){
	            var storeNames = _.pluck(_dispatcher.actionCallbacks[actionName], 'storeName');
	            if (storeNames.indexOf(storeName) === -1) unlisteningDependencies.push(storeName);
	          });
	        });

	        var sorted = _.filter(unsorted, function(action){
	          var noDependencies = _.isEmpty(_.difference(action.after, unlisteningDependencies));
	          if (noDependencies) return true;
	        });

	        var sortedOrder = _.pluck(sorted, 'storeName');
	        var working = _.difference(unsorted, sorted);

	        var cyclic = true;

	        var _dependenciesExist = function(dep){return sortedOrder.indexOf(dep) >= 0;};
	        var _dependencyDoesNotListen = function(dep){return unlisteningDependencies.indexOf(dep) >= 0;};
	        var _removeDependenciesFromWorkingList = function(action){
	          if(_.every(action.after, function(dep){
	            return _dependenciesExist(dep) || _dependencyDoesNotListen(dep);
	          })){
	            cyclic = false;
	            sorted.push(action);
	            sortedOrder.push(action.storeName);
	          }
	        };

	        while(!_.isEmpty(working)){
	          cyclic = true;

	          working.forEach(_removeDependenciesFromWorkingList);

	          if(cyclic) throw new errors.dispatcher.cyclicDependency();

	          working = _.difference(working, sorted);
	        }

	        _dispatcher.actionCallbacks[actionName] = sorted;
	      }
	    },

	    onAction: function (storeName, actionName, after, callback) {
	      if (_dispatcher.actionCallbacks[actionName] == null) {
	        _dispatcher.actionCallbacks[actionName] = [];
	      }

	      _dispatcher.actionCallbacks[actionName].push({
	        storeName: storeName,
	        after: after || [],
	        callback: callback
	      });
	    },

	    registerStoreCallback: function (storeName, callback, adapterName) {
	      if (_dispatcher.storeCallbacks[storeName] == null) {
	        _dispatcher.storeCallbacks[storeName] = [];
	      }
	      _dispatcher.storeCallbacks[storeName].push({
	        adapterName: adapterName,
	        callback: callback
	      });
	    },

	    unregisterStoreCallback: function (storeName, callback, adapterName) {
	      _.remove(_dispatcher.storeCallbacks[storeName], function (cb){
	        return (cb.callback === callback);
	      });
	    },

	    storeHasChanged: function (storeName) {
	      _dispatcher.changedStores[storeName] = true;
	    },

	    dispatchAction: function (actionName, args) {
	      if (_dispatcher.actionCallbacks[actionName] != null) {
	        _.forEach(_dispatcher.actionCallbacks[actionName], function (cb) {
	          cb.callback.apply(null, args);
	        });
	      }
	      for (var storeName in _dispatcher.changedStores) {
	        if (_dispatcher.storeCallbacks[storeName] != null) {
	          _.forEach(_dispatcher.storeCallbacks[storeName], function (cb) {
	            if (cb != undefined) cb.callback();
	          });
	        }
	      }
	    },

	    dispatchActions: function () {
	      _dispatcher.canDispatch = false;

	      for (var offset = 0; offset < _dispatcher.actionQueue.length; offset++) {
	        var actionName = _dispatcher.actionQueue[offset].actionName;
	        var args = _dispatcher.actionQueue[offset].args;

	        _dispatcher.dispatchAction(actionName, args);
	      }

	      _dispatcher.actionQueue = [];
	      _dispatcher.canDispatch = true;
	    },
	    enqueueAction: function (actionName, args) {
	      _dispatcher.actionQueue.push({
	        actionName: actionName,
	        args: args
	      });
	      if (_dispatcher.canDispatch) {
	        _dispatcher.dispatchActions();
	      }
	    },
	    runStoreCallbacks: function () {
	      for (var storeName in _dispatcher.changedStores) {
	        if (_dispatcher.storeCallbacks[storeName] != null) {
	          for (var cb in _dispatcher.storeCallbacks[storeName]) cb.callback();
	        }
	      }
	    }
	  });

	  return _dispatcher;
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var _ = __webpack_require__(1);

	module.exports = function (constructor) {
	  return function (first, optional) {
	    if (typeof first === 'string' && optional) {
	      constructor.call(null, first, optional);
	    } else if (_.isObject(first)) {
	      _.each(first, function (defn, name) {
	        constructor.call(null, name, defn);
	      });
	    }
	  };
	};


/***/ }
/******/ ])
});
;