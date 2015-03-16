(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define(factory);
	else if(typeof exports === 'object')
		exports["pipeline"] = factory();
	else
		root["pipeline"] = factory();
})(this, function() {
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

	/* WEBPACK VAR INJECTION */(function(module, global) {/**
	 * @license
	 * lodash 3.5.0 (Custom Build) <https://lodash.com/>
	 * Build: `lodash include="each,forEach,pluck,filter,isEmpty,pluck,difference,remove,isFunction,omit,intersection,extend,clone,cloneDeep,contains,intersection,keys,isObject,isArray,isString,pull,every" minus="chain" exports="node"`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.2 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	;(function() {

	  /** Used as a safe reference for `undefined` in pre-ES5 environments. */
	  var undefined;

	  /** Used as the semantic version number. */
	  var VERSION = '3.5.0';

	  /** `Object#toString` result references. */
	  var argsTag = '[object Arguments]',
	      arrayTag = '[object Array]',
	      boolTag = '[object Boolean]',
	      dateTag = '[object Date]',
	      errorTag = '[object Error]',
	      funcTag = '[object Function]',
	      mapTag = '[object Map]',
	      numberTag = '[object Number]',
	      objectTag = '[object Object]',
	      regexpTag = '[object RegExp]',
	      setTag = '[object Set]',
	      stringTag = '[object String]',
	      weakMapTag = '[object WeakMap]';

	  var arrayBufferTag = '[object ArrayBuffer]',
	      float32Tag = '[object Float32Array]',
	      float64Tag = '[object Float64Array]',
	      int8Tag = '[object Int8Array]',
	      int16Tag = '[object Int16Array]',
	      int32Tag = '[object Int32Array]',
	      uint8Tag = '[object Uint8Array]',
	      uint8ClampedTag = '[object Uint8ClampedArray]',
	      uint16Tag = '[object Uint16Array]',
	      uint32Tag = '[object Uint32Array]';

	  /** Used to match `RegExp` flags from their coerced string values. */
	  var reFlags = /\w*$/;

	  /** Used to detect named functions. */
	  var reFuncName = /^\s*function[ \n\r\t]+\w/;

	  /** Used to detect host constructors (Safari > 5). */
	  var reHostCtor = /^\[object .+?Constructor\]$/;

	  /**
	   * Used to match `RegExp` special characters.
	   * See this [article on `RegExp` characters](http://www.regular-expressions.info/characters.html#special)
	   * for more details.
	   */
	  var reRegExpChars = /[.*+?^${}()|[\]\/\\]/g,
	      reHasRegExpChars = RegExp(reRegExpChars.source);

	  /** Used to detect functions containing a `this` reference. */
	  var reThis = /\bthis\b/;

	  /** Used to fix the JScript `[[DontEnum]]` bug. */
	  var shadowProps = [
	    'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
	    'toLocaleString', 'toString', 'valueOf'
	  ];

	  /** Used to identify `toStringTag` values of typed arrays. */
	  var typedArrayTags = {};
	  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
	  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
	  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
	  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
	  typedArrayTags[uint32Tag] = true;
	  typedArrayTags[argsTag] = typedArrayTags[arrayTag] =
	  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
	  typedArrayTags[dateTag] = typedArrayTags[errorTag] =
	  typedArrayTags[funcTag] = typedArrayTags[mapTag] =
	  typedArrayTags[numberTag] = typedArrayTags[objectTag] =
	  typedArrayTags[regexpTag] = typedArrayTags[setTag] =
	  typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;

	  /** Used to identify `toStringTag` values supported by `_.clone`. */
	  var cloneableTags = {};
	  cloneableTags[argsTag] = cloneableTags[arrayTag] =
	  cloneableTags[arrayBufferTag] = cloneableTags[boolTag] =
	  cloneableTags[dateTag] = cloneableTags[float32Tag] =
	  cloneableTags[float64Tag] = cloneableTags[int8Tag] =
	  cloneableTags[int16Tag] = cloneableTags[int32Tag] =
	  cloneableTags[numberTag] = cloneableTags[objectTag] =
	  cloneableTags[regexpTag] = cloneableTags[stringTag] =
	  cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] =
	  cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
	  cloneableTags[errorTag] = cloneableTags[funcTag] =
	  cloneableTags[mapTag] = cloneableTags[setTag] =
	  cloneableTags[weakMapTag] = false;

	  /** Used to determine if values are of the language type `Object`. */
	  var objectTypes = {
	    'function': true,
	    'object': true
	  };

	  /** Detect free variable `exports`. */
	  var freeExports = objectTypes[typeof exports] && exports && !exports.nodeType && exports;

	  /** Detect free variable `module`. */
	  var freeModule = objectTypes[typeof module] && module && !module.nodeType && module;

	  /** Detect free variable `global` from Node.js. */
	  var freeGlobal = freeExports && freeModule && typeof global == 'object' && global;

	  /** Detect free variable `window`. */
	  var freeWindow = objectTypes[typeof window] && window;

	  /** Detect the popular CommonJS extension `module.exports`. */
	  var moduleExports = freeModule && freeModule.exports === freeExports && freeExports;

	  /**
	   * Used as a reference to the global object.
	   *
	   * The `this` value is used if it is the global object to avoid Greasemonkey's
	   * restricted `window` object, otherwise the `window` object is used.
	   */
	  var root = freeGlobal || ((freeWindow !== (this && this.window)) && freeWindow) || this;

	  /*--------------------------------------------------------------------------*/

	  /**
	   * The base implementation of `_.indexOf` without support for binary searches.
	   *
	   * @private
	   * @param {Array} array The array to search.
	   * @param {*} value The value to search for.
	   * @param {number} fromIndex The index to search from.
	   * @returns {number} Returns the index of the matched value, else `-1`.
	   */
	  function baseIndexOf(array, value, fromIndex) {
	    if (value !== value) {
	      return indexOfNaN(array, fromIndex);
	    }
	    var index = fromIndex - 1,
	        length = array.length;

	    while (++index < length) {
	      if (array[index] === value) {
	        return index;
	      }
	    }
	    return -1;
	  }

	  /**
	   * The base implementation of `_.isFunction` without support for environments
	   * with incorrect `typeof` results.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	   */
	  function baseIsFunction(value) {
	    // Avoid a Chakra JIT bug in compatibility modes of IE 11.
	    // See https://github.com/jashkenas/underscore/issues/1621 for more details.
	    return typeof value == 'function' || false;
	  }

	  /**
	   * Converts `value` to a string if it is not one. An empty string is returned
	   * for `null` or `undefined` values.
	   *
	   * @private
	   * @param {*} value The value to process.
	   * @returns {string} Returns the string.
	   */
	  function baseToString(value) {
	    if (typeof value == 'string') {
	      return value;
	    }
	    return value == null ? '' : (value + '');
	  }

	  /**
	   * Gets the index at which the first occurrence of `NaN` is found in `array`.
	   * If `fromRight` is provided elements of `array` are iterated from right to left.
	   *
	   * @private
	   * @param {Array} array The array to search.
	   * @param {number} fromIndex The index to search from.
	   * @param {boolean} [fromRight] Specify iterating from right to left.
	   * @returns {number} Returns the index of the matched `NaN`, else `-1`.
	   */
	  function indexOfNaN(array, fromIndex, fromRight) {
	    var length = array.length,
	        index = fromIndex + (fromRight ? 0 : -1);

	    while ((fromRight ? index-- : ++index < length)) {
	      var other = array[index];
	      if (other !== other) {
	        return index;
	      }
	    }
	    return -1;
	  }

	  /**
	   * Checks if `value` is a host object in IE < 9.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	   */
	  var isHostObject = (function() {
	    try {
	      Object({ 'toString': 0 } + '');
	    } catch(e) {
	      return function() { return false; };
	    }
	    return function(value) {
	      // IE < 9 presents many host objects as `Object` objects that can coerce
	      // to strings despite having improperly defined `toString` methods.
	      return typeof value.toString != 'function' && typeof (value + '') == 'string';
	    };
	  }());

	  /**
	   * Checks if `value` is object-like.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	   */
	  function isObjectLike(value) {
	    return (value && typeof value == 'object') || false;
	  }

	  /*--------------------------------------------------------------------------*/

	  /** Used for native method references. */
	  var arrayProto = Array.prototype,
	      errorProto = Error.prototype,
	      objectProto = Object.prototype,
	      stringProto = String.prototype;

	  /** Used to resolve the decompiled source of functions. */
	  var fnToString = Function.prototype.toString;

	  /** Used to check objects for own properties. */
	  var hasOwnProperty = objectProto.hasOwnProperty;

	  /**
	   * Used to resolve the `toStringTag` of values.
	   * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.prototype.tostring)
	   * for more details.
	   */
	  var objToString = objectProto.toString;

	  /** Used to detect if a method is native. */
	  var reNative = RegExp('^' +
	    escapeRegExp(objToString)
	    .replace(/toString|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	  );

	  /** Native method references. */
	  var ArrayBuffer = isNative(ArrayBuffer = root.ArrayBuffer) && ArrayBuffer,
	      bufferSlice = isNative(bufferSlice = ArrayBuffer && new ArrayBuffer(0).slice) && bufferSlice,
	      floor = Math.floor,
	      propertyIsEnumerable = objectProto.propertyIsEnumerable,
	      Set = isNative(Set = root.Set) && Set,
	      splice = arrayProto.splice,
	      Uint8Array = isNative(Uint8Array = root.Uint8Array) && Uint8Array,
	      WeakMap = isNative(WeakMap = root.WeakMap) && WeakMap;

	  /** Used to clone array buffers. */
	  var Float64Array = (function() {
	    // Safari 5 errors when using an array buffer to initialize a typed array
	    // where the array buffer's `byteLength` is not a multiple of the typed
	    // array's `BYTES_PER_ELEMENT`.
	    try {
	      var func = isNative(func = root.Float64Array) && func,
	          result = new func(new ArrayBuffer(10), 0, 1) && func;
	    } catch(e) {}
	    return result;
	  }());

	  /* Native method references for those with the same name as other `lodash` methods. */
	  var nativeIsArray = isNative(nativeIsArray = Array.isArray) && nativeIsArray,
	      nativeCreate = isNative(nativeCreate = Object.create) && nativeCreate,
	      nativeKeys = isNative(nativeKeys = Object.keys) && nativeKeys,
	      nativeMax = Math.max,
	      nativeMin = Math.min;

	  /** Used as references for the maximum length and index of an array. */
	  var MAX_ARRAY_LENGTH = Math.pow(2, 32) - 1,
	      MAX_ARRAY_INDEX =  MAX_ARRAY_LENGTH - 1,
	      HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;

	  /** Used as the size, in bytes, of each `Float64Array` element. */
	  var FLOAT64_BYTES_PER_ELEMENT = Float64Array ? Float64Array.BYTES_PER_ELEMENT : 0;

	  /**
	   * Used as the maximum length of an array-like value.
	   * See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-number.max_safe_integer)
	   * for more details.
	   */
	  var MAX_SAFE_INTEGER = Math.pow(2, 53) - 1;

	  /** Used to store function metadata. */
	  var metaMap = WeakMap && new WeakMap;

	  /** Used to lookup a type array constructors by `toStringTag`. */
	  var ctorByTag = {};
	  ctorByTag[float32Tag] = root.Float32Array;
	  ctorByTag[float64Tag] = root.Float64Array;
	  ctorByTag[int8Tag] = root.Int8Array;
	  ctorByTag[int16Tag] = root.Int16Array;
	  ctorByTag[int32Tag] = root.Int32Array;
	  ctorByTag[uint8Tag] = root.Uint8Array;
	  ctorByTag[uint8ClampedTag] = root.Uint8ClampedArray;
	  ctorByTag[uint16Tag] = root.Uint16Array;
	  ctorByTag[uint32Tag] = root.Uint32Array;

	  /** Used to avoid iterating over non-enumerable properties in IE < 9. */
	  var nonEnumProps = {};
	  nonEnumProps[arrayTag] = nonEnumProps[dateTag] = nonEnumProps[numberTag] = { 'constructor': true, 'toLocaleString': true, 'toString': true, 'valueOf': true };
	  nonEnumProps[boolTag] = nonEnumProps[stringTag] = { 'constructor': true, 'toString': true, 'valueOf': true };
	  nonEnumProps[errorTag] = nonEnumProps[funcTag] = nonEnumProps[regexpTag] = { 'constructor': true, 'toString': true };
	  nonEnumProps[objectTag] = { 'constructor': true };

	  arrayEach(shadowProps, function(key) {
	    for (var tag in nonEnumProps) {
	      if (hasOwnProperty.call(nonEnumProps, tag)) {
	        var props = nonEnumProps[tag];
	        props[key] = hasOwnProperty.call(props, key);
	      }
	    }
	  });

	  /*------------------------------------------------------------------------*/

	  /**
	   * Creates a `lodash` object which wraps `value` to enable implicit chaining.
	   * Methods that operate on and return arrays, collections, and functions can
	   * be chained together. Methods that return a boolean or single value will
	   * automatically end the chain returning the unwrapped value. Explicit chaining
	   * may be enabled using `_.chain`. The execution of chained methods is lazy,
	   * that is, execution is deferred until `_#value` is implicitly or explicitly
	   * called.
	   *
	   * Lazy evaluation allows several methods to support shortcut fusion. Shortcut
	   * fusion is an optimization that merges iteratees to avoid creating intermediate
	   * arrays and reduce the number of iteratee executions.
	   *
	   * Chaining is supported in custom builds as long as the `_#value` method is
	   * directly or indirectly included in the build.
	   *
	   * In addition to lodash methods, wrappers have `Array` and `String` methods.
	   *
	   * The wrapper `Array` methods are:
	   * `concat`, `join`, `pop`, `push`, `reverse`, `shift`, `slice`, `sort`,
	   * `splice`, and `unshift`
	   *
	   * The wrapper `String` methods are:
	   * `replace` and `split`
	   *
	   * The wrapper methods that support shortcut fusion are:
	   * `compact`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `filter`,
	   * `first`, `initial`, `last`, `map`, `pluck`, `reject`, `rest`, `reverse`,
	   * `slice`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `toArray`,
	   * and `where`
	   *
	   * The chainable wrapper methods are:
	   * `after`, `ary`, `assign`, `at`, `before`, `bind`, `bindAll`, `bindKey`,
	   * `callback`, `chain`, `chunk`, `commit`, `compact`, `concat`, `constant`,
	   * `countBy`, `create`, `curry`, `debounce`, `defaults`, `defer`, `delay`,
	   * `difference`, `drop`, `dropRight`, `dropRightWhile`, `dropWhile`, `fill`,
	   * `filter`, `flatten`, `flattenDeep`, `flow`, `flowRight`, `forEach`,
	   * `forEachRight`, `forIn`, `forInRight`, `forOwn`, `forOwnRight`, `functions`,
	   * `groupBy`, `indexBy`, `initial`, `intersection`, `invert`, `invoke`, `keys`,
	   * `keysIn`, `map`, `mapValues`, `matches`, `matchesProperty`, `memoize`, `merge`,
	   * `mixin`, `negate`, `noop`, `omit`, `once`, `pairs`, `partial`, `partialRight`,
	   * `partition`, `pick`, `plant`, `pluck`, `property`, `propertyOf`, `pull`,
	   * `pullAt`, `push`, `range`, `rearg`, `reject`, `remove`, `rest`, `reverse`,
	   * `shuffle`, `slice`, `sort`, `sortBy`, `sortByAll`, `sortByOrder`, `splice`,
	   * `spread`, `take`, `takeRight`, `takeRightWhile`, `takeWhile`, `tap`,
	   * `throttle`, `thru`, `times`, `toArray`, `toPlainObject`, `transform`,
	   * `union`, `uniq`, `unshift`, `unzip`, `values`, `valuesIn`, `where`,
	   * `without`, `wrap`, `xor`, `zip`, and `zipObject`
	   *
	   * The wrapper methods that are **not** chainable by default are:
	   * `add`, `attempt`, `camelCase`, `capitalize`, `clone`, `cloneDeep`, `deburr`,
	   * `endsWith`, `escape`, `escapeRegExp`, `every`, `find`, `findIndex`, `findKey`,
	   * `findLast`, `findLastIndex`, `findLastKey`, `findWhere`, `first`, `has`,
	   * `identity`, `includes`, `indexOf`, `inRange`, `isArguments`, `isArray`,
	   * `isBoolean`, `isDate`, `isElement`, `isEmpty`, `isEqual`, `isError`,
	   * `isFinite`,`isFunction`, `isMatch`, `isNative`, `isNaN`, `isNull`, `isNumber`,
	   * `isObject`, `isPlainObject`, `isRegExp`, `isString`, `isUndefined`,
	   * `isTypedArray`, `join`, `kebabCase`, `last`, `lastIndexOf`, `max`, `min`,
	   * `noConflict`, `now`, `pad`, `padLeft`, `padRight`, `parseInt`, `pop`,
	   * `random`, `reduce`, `reduceRight`, `repeat`, `result`, `runInContext`,
	   * `shift`, `size`, `snakeCase`, `some`, `sortedIndex`, `sortedLastIndex`,
	   * `startCase`, `startsWith`, `sum`, `template`, `trim`, `trimLeft`,
	   * `trimRight`, `trunc`, `unescape`, `uniqueId`, `value`, and `words`
	   *
	   * The wrapper method `sample` will return a wrapped value when `n` is provided,
	   * otherwise an unwrapped value is returned.
	   *
	   * @name _
	   * @constructor
	   * @category Chain
	   * @param {*} value The value to wrap in a `lodash` instance.
	   * @returns {Object} Returns the new `lodash` wrapper instance.
	   * @example
	   *
	   * var wrapped = _([1, 2, 3]);
	   *
	   * // returns an unwrapped value
	   * wrapped.reduce(function(sum, n) {
	   *   return sum + n;
	   * });
	   * // => 6
	   *
	   * // returns a wrapped value
	   * var squares = wrapped.map(function(n) {
	   *   return n * n;
	   * });
	   *
	   * _.isArray(squares);
	   * // => false
	   *
	   * _.isArray(squares.value());
	   * // => true
	   */
	  function lodash() {
	    // No operation performed.
	  }

	  /**
	   * An object environment feature flags.
	   *
	   * @static
	   * @memberOf _
	   * @type Object
	   */
	  var support = lodash.support = {};

	  (function(x) {
	    var Ctor = function() { this.x = 1; },
	        object = { '0': 1, 'length': 1 },
	        props = [];

	    Ctor.prototype = { 'valueOf': 1, 'y': 1 };
	    for (var key in new Ctor) { props.push(key); }

	    /**
	     * Detect if the `toStringTag` of `arguments` objects is resolvable
	     * (all but Firefox < 4, IE < 9).
	     *
	     * @memberOf _.support
	     * @type boolean
	     */
	    support.argsTag = objToString.call(arguments) == argsTag;

	    /**
	     * Detect if `name` or `message` properties of `Error.prototype` are
	     * enumerable by default (IE < 9, Safari < 5.1).
	     *
	     * @memberOf _.support
	     * @type boolean
	     */
	    support.enumErrorProps = propertyIsEnumerable.call(errorProto, 'message') ||
	      propertyIsEnumerable.call(errorProto, 'name');

	    /**
	     * Detect if `prototype` properties are enumerable by default.
	     *
	     * Firefox < 3.6, Opera > 9.50 - Opera < 11.60, and Safari < 5.1
	     * (if the prototype or a property on the prototype has been set)
	     * incorrectly set the `[[Enumerable]]` value of a function's `prototype`
	     * property to `true`.
	     *
	     * @memberOf _.support
	     * @type boolean
	     */
	    support.enumPrototypes = propertyIsEnumerable.call(Ctor, 'prototype');

	    /**
	     * Detect if functions can be decompiled by `Function#toString`
	     * (all but Firefox OS certified apps, older Opera mobile browsers, and
	     * the PlayStation 3; forced `false` for Windows 8 apps).
	     *
	     * @memberOf _.support
	     * @type boolean
	     */
	    support.funcDecomp = !isNative(root.WinRTError) && reThis.test(function() { return this; });

	    /**
	     * Detect if `Function#name` is supported (all but IE).
	     *
	     * @memberOf _.support
	     * @type boolean
	     */
	    support.funcNames = typeof Function.name == 'string';

	    /**
	     * Detect if string indexes are non-enumerable
	     * (IE < 9, RingoJS, Rhino, Narwhal).
	     *
	     * @memberOf _.support
	     * @type boolean
	     */
	    support.nonEnumStrings = !propertyIsEnumerable.call('x', 0);

	    /**
	     * Detect if properties shadowing those on `Object.prototype` are
	     * non-enumerable.
	     *
	     * In IE < 9 an object's own properties, shadowing non-enumerable ones,
	     * are made non-enumerable as well (a.k.a the JScript `[[DontEnum]]` bug).
	     *
	     * @memberOf _.support
	     * @type boolean
	     */
	    support.nonEnumShadows = !/valueOf/.test(props);

	    /**
	     * Detect if `Array#shift` and `Array#splice` augment array-like objects
	     * correctly.
	     *
	     * Firefox < 10, compatibility modes of IE 8, and IE < 9 have buggy Array `shift()`
	     * and `splice()` functions that fail to remove the last element, `value[0]`,
	     * of array-like objects even though the `length` property is set to `0`.
	     * The `shift()` method is buggy in compatibility modes of IE 8, while `splice()`
	     * is buggy regardless of mode in IE < 9.
	     *
	     * @memberOf _.support
	     * @type boolean
	     */
	    support.spliceObjects = (splice.call(object, 0, 1), !object[0]);

	    /**
	     * Detect lack of support for accessing string characters by index.
	     *
	     * IE < 8 can't access characters by index. IE 8 can only access characters
	     * by index on string literals, not string objects.
	     *
	     * @memberOf _.support
	     * @type boolean
	     */
	    support.unindexedChars = ('x'[0] + Object('x')[0]) != 'xx';

	    /**
	     * Detect if `arguments` object indexes are non-enumerable.
	     *
	     * In Firefox < 4, IE < 9, PhantomJS, and Safari < 5.1 `arguments` object
	     * indexes are non-enumerable. Chrome < 25 and Node.js < 0.11.0 treat
	     * `arguments` object indexes as non-enumerable and fail `hasOwnProperty`
	     * checks for indexes that exceed their function's formal parameters with
	     * associated values of `0`.
	     *
	     * @memberOf _.support
	     * @type boolean
	     */
	    try {
	      support.nonEnumArgs = !propertyIsEnumerable.call(arguments, 1);
	    } catch(e) {
	      support.nonEnumArgs = true;
	    }
	  }(0, 0));

	  /*------------------------------------------------------------------------*/

	  /**
	   *
	   * Creates a cache object to store unique values.
	   *
	   * @private
	   * @param {Array} [values] The values to cache.
	   */
	  function SetCache(values) {
	    var length = values ? values.length : 0;

	    this.data = { 'hash': nativeCreate(null), 'set': new Set };
	    while (length--) {
	      this.push(values[length]);
	    }
	  }

	  /**
	   * Checks if `value` is in `cache` mimicking the return signature of
	   * `_.indexOf` by returning `0` if the value is found, else `-1`.
	   *
	   * @private
	   * @param {Object} cache The cache to search.
	   * @param {*} value The value to search for.
	   * @returns {number} Returns `0` if `value` is found, else `-1`.
	   */
	  function cacheIndexOf(cache, value) {
	    var data = cache.data,
	        result = (typeof value == 'string' || isObject(value)) ? data.set.has(value) : data.hash[value];

	    return result ? 0 : -1;
	  }

	  /**
	   * Adds `value` to the cache.
	   *
	   * @private
	   * @name push
	   * @memberOf SetCache
	   * @param {*} value The value to cache.
	   */
	  function cachePush(value) {
	    var data = this.data;
	    if (typeof value == 'string' || isObject(value)) {
	      data.set.add(value);
	    } else {
	      data.hash[value] = true;
	    }
	  }

	  /*------------------------------------------------------------------------*/

	  /**
	   * Copies the values of `source` to `array`.
	   *
	   * @private
	   * @param {Array} source The array to copy values from.
	   * @param {Array} [array=[]] The array to copy values to.
	   * @returns {Array} Returns `array`.
	   */
	  function arrayCopy(source, array) {
	    var index = -1,
	        length = source.length;

	    array || (array = Array(length));
	    while (++index < length) {
	      array[index] = source[index];
	    }
	    return array;
	  }

	  /**
	   * A specialized version of `_.forEach` for arrays without support for callback
	   * shorthands or `this` binding.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @returns {Array} Returns `array`.
	   */
	  function arrayEach(array, iteratee) {
	    var index = -1,
	        length = array.length;

	    while (++index < length) {
	      if (iteratee(array[index], index, array) === false) {
	        break;
	      }
	    }
	    return array;
	  }

	  /**
	   * A specialized version of `_.every` for arrays without support for callback
	   * shorthands or `this` binding.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} predicate The function invoked per iteration.
	   * @returns {boolean} Returns `true` if all elements pass the predicate check,
	   *  else `false`.
	   */
	  function arrayEvery(array, predicate) {
	    var index = -1,
	        length = array.length;

	    while (++index < length) {
	      if (!predicate(array[index], index, array)) {
	        return false;
	      }
	    }
	    return true;
	  }

	  /**
	   * A specialized version of `_.filter` for arrays without support for callback
	   * shorthands or `this` binding.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} predicate The function invoked per iteration.
	   * @returns {Array} Returns the new filtered array.
	   */
	  function arrayFilter(array, predicate) {
	    var index = -1,
	        length = array.length,
	        resIndex = -1,
	        result = [];

	    while (++index < length) {
	      var value = array[index];
	      if (predicate(value, index, array)) {
	        result[++resIndex] = value;
	      }
	    }
	    return result;
	  }

	  /**
	   * A specialized version of `_.map` for arrays without support for callback
	   * shorthands or `this` binding.
	   *
	   * @private
	   * @param {Array} array The array to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @returns {Array} Returns the new mapped array.
	   */
	  function arrayMap(array, iteratee) {
	    var index = -1,
	        length = array.length,
	        result = Array(length);

	    while (++index < length) {
	      result[index] = iteratee(array[index], index, array);
	    }
	    return result;
	  }

	  /**
	   * The base implementation of `_.assign` without support for argument juggling,
	   * multiple sources, and `this` binding `customizer` functions.
	   *
	   * @private
	   * @param {Object} object The destination object.
	   * @param {Object} source The source object.
	   * @param {Function} [customizer] The function to customize assigning values.
	   * @returns {Object} Returns the destination object.
	   */
	  function baseAssign(object, source, customizer) {
	    var props = keys(source);
	    if (!customizer) {
	      return baseCopy(source, object, props);
	    }
	    var index = -1,
	        length = props.length;

	    while (++index < length) {
	      var key = props[index],
	          value = object[key],
	          result = customizer(value, source[key], key, object, source);

	      if ((result === result ? (result !== value) : (value === value)) ||
	          (typeof value == 'undefined' && !(key in object))) {
	        object[key] = result;
	      }
	    }
	    return object;
	  }

	  /**
	   * Copies the properties of `source` to `object`.
	   *
	   * @private
	   * @param {Object} source The object to copy properties from.
	   * @param {Object} [object={}] The object to copy properties to.
	   * @param {Array} props The property names to copy.
	   * @returns {Object} Returns `object`.
	   */
	  function baseCopy(source, object, props) {
	    if (!props) {
	      props = object;
	      object = {};
	    }
	    var index = -1,
	        length = props.length;

	    while (++index < length) {
	      var key = props[index];
	      object[key] = source[key];
	    }
	    return object;
	  }

	  /**
	   * The base implementation of `_.callback` which supports specifying the
	   * number of arguments to provide to `func`.
	   *
	   * @private
	   * @param {*} [func=_.identity] The value to convert to a callback.
	   * @param {*} [thisArg] The `this` binding of `func`.
	   * @param {number} [argCount] The number of arguments to provide to `func`.
	   * @returns {Function} Returns the callback.
	   */
	  function baseCallback(func, thisArg, argCount) {
	    var type = typeof func;
	    if (type == 'function') {
	      return (typeof thisArg != 'undefined' && isBindable(func))
	        ? bindCallback(func, thisArg, argCount)
	        : func;
	    }
	    if (func == null) {
	      return identity;
	    }
	    if (type == 'object') {
	      return baseMatches(func);
	    }
	    return typeof thisArg == 'undefined'
	      ? baseProperty(func + '')
	      : baseMatchesProperty(func + '', thisArg);
	  }

	  /**
	   * The base implementation of `_.clone` without support for argument juggling
	   * and `this` binding `customizer` functions.
	   *
	   * @private
	   * @param {*} value The value to clone.
	   * @param {boolean} [isDeep] Specify a deep clone.
	   * @param {Function} [customizer] The function to customize cloning values.
	   * @param {string} [key] The key of `value`.
	   * @param {Object} [object] The object `value` belongs to.
	   * @param {Array} [stackA=[]] Tracks traversed source objects.
	   * @param {Array} [stackB=[]] Associates clones with source counterparts.
	   * @returns {*} Returns the cloned value.
	   */
	  function baseClone(value, isDeep, customizer, key, object, stackA, stackB) {
	    var result;
	    if (customizer) {
	      result = object ? customizer(value, key, object) : customizer(value);
	    }
	    if (typeof result != 'undefined') {
	      return result;
	    }
	    if (!isObject(value)) {
	      return value;
	    }
	    var isArr = isArray(value);
	    if (isArr) {
	      result = initCloneArray(value);
	      if (!isDeep) {
	        return arrayCopy(value, result);
	      }
	    } else {
	      var tag = objToString.call(value),
	          isFunc = tag == funcTag;

	      if (tag == objectTag || tag == argsTag || (isFunc && !object)) {
	        if (isHostObject(value)) {
	          return object ? value : {};
	        }
	        result = initCloneObject(isFunc ? {} : value);
	        if (!isDeep) {
	          return baseCopy(value, result, keys(value));
	        }
	      } else {
	        return cloneableTags[tag]
	          ? initCloneByTag(value, tag, isDeep)
	          : (object ? value : {});
	      }
	    }
	    // Check for circular references and return corresponding clone.
	    stackA || (stackA = []);
	    stackB || (stackB = []);

	    var length = stackA.length;
	    while (length--) {
	      if (stackA[length] == value) {
	        return stackB[length];
	      }
	    }
	    // Add the source value to the stack of traversed objects and associate it with its clone.
	    stackA.push(value);
	    stackB.push(result);

	    // Recursively populate clone (susceptible to call stack limits).
	    (isArr ? arrayEach : baseForOwn)(value, function(subValue, key) {
	      result[key] = baseClone(subValue, isDeep, customizer, key, value, stackA, stackB);
	    });
	    return result;
	  }

	  /**
	   * The base implementation of `_.difference` which accepts a single array
	   * of values to exclude.
	   *
	   * @private
	   * @param {Array} array The array to inspect.
	   * @param {Array} values The values to exclude.
	   * @returns {Array} Returns the new array of filtered values.
	   */
	  function baseDifference(array, values) {
	    var length = array ? array.length : 0,
	        result = [];

	    if (!length) {
	      return result;
	    }
	    var index = -1,
	        indexOf = getIndexOf(),
	        isCommon = indexOf == baseIndexOf,
	        cache = (isCommon && values.length >= 200) ? createCache(values) : null,
	        valuesLength = values.length;

	    if (cache) {
	      indexOf = cacheIndexOf;
	      isCommon = false;
	      values = cache;
	    }
	    outer:
	    while (++index < length) {
	      var value = array[index];

	      if (isCommon && value === value) {
	        var valuesIndex = valuesLength;
	        while (valuesIndex--) {
	          if (values[valuesIndex] === value) {
	            continue outer;
	          }
	        }
	        result.push(value);
	      }
	      else if (indexOf(values, value, 0) < 0) {
	        result.push(value);
	      }
	    }
	    return result;
	  }

	  /**
	   * The base implementation of `_.forEach` without support for callback
	   * shorthands and `this` binding.
	   *
	   * @private
	   * @param {Array|Object|string} collection The collection to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @returns {Array|Object|string} Returns `collection`.
	   */
	  function baseEach(collection, iteratee) {
	    var length = collection ? collection.length : 0;
	    if (!isLength(length)) {
	      return baseForOwn(collection, iteratee);
	    }
	    var index = -1,
	        iterable = toObject(collection);

	    while (++index < length) {
	      if (iteratee(iterable[index], index, iterable) === false) {
	        break;
	      }
	    }
	    return collection;
	  }

	  /**
	   * The base implementation of `_.every` without support for callback
	   * shorthands or `this` binding.
	   *
	   * @private
	   * @param {Array|Object|string} collection The collection to iterate over.
	   * @param {Function} predicate The function invoked per iteration.
	   * @returns {boolean} Returns `true` if all elements pass the predicate check,
	   *  else `false`
	   */
	  function baseEvery(collection, predicate) {
	    var result = true;
	    baseEach(collection, function(value, index, collection) {
	      result = !!predicate(value, index, collection);
	      return result;
	    });
	    return result;
	  }

	  /**
	   * The base implementation of `_.filter` without support for callback
	   * shorthands or `this` binding.
	   *
	   * @private
	   * @param {Array|Object|string} collection The collection to iterate over.
	   * @param {Function} predicate The function invoked per iteration.
	   * @returns {Array} Returns the new filtered array.
	   */
	  function baseFilter(collection, predicate) {
	    var result = [];
	    baseEach(collection, function(value, index, collection) {
	      if (predicate(value, index, collection)) {
	        result.push(value);
	      }
	    });
	    return result;
	  }

	  /**
	   * The base implementation of `_.flatten` with added support for restricting
	   * flattening and specifying the start index.
	   *
	   * @private
	   * @param {Array} array The array to flatten.
	   * @param {boolean} isDeep Specify a deep flatten.
	   * @param {boolean} isStrict Restrict flattening to arrays and `arguments` objects.
	   * @param {number} fromIndex The index to start from.
	   * @returns {Array} Returns the new flattened array.
	   */
	  function baseFlatten(array, isDeep, isStrict, fromIndex) {
	    var index = fromIndex - 1,
	        length = array.length,
	        resIndex = -1,
	        result = [];

	    while (++index < length) {
	      var value = array[index];

	      if (isObjectLike(value) && isLength(value.length) && (isArray(value) || isArguments(value))) {
	        if (isDeep) {
	          // Recursively flatten arrays (susceptible to call stack limits).
	          value = baseFlatten(value, isDeep, isStrict, 0);
	        }
	        var valIndex = -1,
	            valLength = value.length;

	        result.length += valLength;
	        while (++valIndex < valLength) {
	          result[++resIndex] = value[valIndex];
	        }
	      } else if (!isStrict) {
	        result[++resIndex] = value;
	      }
	    }
	    return result;
	  }

	  /**
	   * The base implementation of `baseForIn` and `baseForOwn` which iterates
	   * over `object` properties returned by `keysFunc` invoking `iteratee` for
	   * each property. Iterator functions may exit iteration early by explicitly
	   * returning `false`.
	   *
	   * @private
	   * @param {Object} object The object to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @param {Function} keysFunc The function to get the keys of `object`.
	   * @returns {Object} Returns `object`.
	   */
	  function baseFor(object, iteratee, keysFunc) {
	    var index = -1,
	        iterable = toObject(object),
	        props = keysFunc(object),
	        length = props.length;

	    while (++index < length) {
	      var key = props[index];
	      if (iteratee(iterable[key], key, iterable) === false) {
	        break;
	      }
	    }
	    return object;
	  }

	  /**
	   * The base implementation of `_.forIn` without support for callback
	   * shorthands and `this` binding.
	   *
	   * @private
	   * @param {Object} object The object to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @returns {Object} Returns `object`.
	   */
	  function baseForIn(object, iteratee) {
	    return baseFor(object, iteratee, keysIn);
	  }

	  /**
	   * The base implementation of `_.forOwn` without support for callback
	   * shorthands and `this` binding.
	   *
	   * @private
	   * @param {Object} object The object to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @returns {Object} Returns `object`.
	   */
	  function baseForOwn(object, iteratee) {
	    return baseFor(object, iteratee, keys);
	  }

	  /**
	   * The base implementation of `_.isEqual` without support for `this` binding
	   * `customizer` functions.
	   *
	   * @private
	   * @param {*} value The value to compare.
	   * @param {*} other The other value to compare.
	   * @param {Function} [customizer] The function to customize comparing values.
	   * @param {boolean} [isWhere] Specify performing partial comparisons.
	   * @param {Array} [stackA] Tracks traversed `value` objects.
	   * @param {Array} [stackB] Tracks traversed `other` objects.
	   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	   */
	  function baseIsEqual(value, other, customizer, isWhere, stackA, stackB) {
	    // Exit early for identical values.
	    if (value === other) {
	      // Treat `+0` vs. `-0` as not equal.
	      return value !== 0 || (1 / value == 1 / other);
	    }
	    var valType = typeof value,
	        othType = typeof other;

	    // Exit early for unlike primitive values.
	    if ((valType != 'function' && valType != 'object' && othType != 'function' && othType != 'object') ||
	        value == null || other == null) {
	      // Return `false` unless both values are `NaN`.
	      return value !== value && other !== other;
	    }
	    return baseIsEqualDeep(value, other, baseIsEqual, customizer, isWhere, stackA, stackB);
	  }

	  /**
	   * A specialized version of `baseIsEqual` for arrays and objects which performs
	   * deep comparisons and tracks traversed objects enabling objects with circular
	   * references to be compared.
	   *
	   * @private
	   * @param {Object} object The object to compare.
	   * @param {Object} other The other object to compare.
	   * @param {Function} equalFunc The function to determine equivalents of values.
	   * @param {Function} [customizer] The function to customize comparing objects.
	   * @param {boolean} [isWhere] Specify performing partial comparisons.
	   * @param {Array} [stackA=[]] Tracks traversed `value` objects.
	   * @param {Array} [stackB=[]] Tracks traversed `other` objects.
	   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	   */
	  function baseIsEqualDeep(object, other, equalFunc, customizer, isWhere, stackA, stackB) {
	    var objIsArr = isArray(object),
	        othIsArr = isArray(other),
	        objTag = arrayTag,
	        othTag = arrayTag;

	    if (!objIsArr) {
	      objTag = objToString.call(object);
	      if (objTag == argsTag) {
	        objTag = objectTag;
	      } else if (objTag != objectTag) {
	        objIsArr = isTypedArray(object);
	      }
	    }
	    if (!othIsArr) {
	      othTag = objToString.call(other);
	      if (othTag == argsTag) {
	        othTag = objectTag;
	      } else if (othTag != objectTag) {
	        othIsArr = isTypedArray(other);
	      }
	    }
	    var objIsObj = objTag == objectTag && !isHostObject(object),
	        othIsObj = othTag == objectTag && !isHostObject(other),
	        isSameTag = objTag == othTag;

	    if (isSameTag && !(objIsArr || objIsObj)) {
	      return equalByTag(object, other, objTag);
	    }
	    var valWrapped = objIsObj && hasOwnProperty.call(object, '__wrapped__'),
	        othWrapped = othIsObj && hasOwnProperty.call(other, '__wrapped__');

	    if (valWrapped || othWrapped) {
	      return equalFunc(valWrapped ? object.value() : object, othWrapped ? other.value() : other, customizer, isWhere, stackA, stackB);
	    }
	    if (!isSameTag) {
	      return false;
	    }
	    // Assume cyclic values are equal.
	    // For more information on detecting circular references see https://es5.github.io/#JO.
	    stackA || (stackA = []);
	    stackB || (stackB = []);

	    var length = stackA.length;
	    while (length--) {
	      if (stackA[length] == object) {
	        return stackB[length] == other;
	      }
	    }
	    // Add `object` and `other` to the stack of traversed objects.
	    stackA.push(object);
	    stackB.push(other);

	    var result = (objIsArr ? equalArrays : equalObjects)(object, other, equalFunc, customizer, isWhere, stackA, stackB);

	    stackA.pop();
	    stackB.pop();

	    return result;
	  }

	  /**
	   * The base implementation of `_.isMatch` without support for callback
	   * shorthands or `this` binding.
	   *
	   * @private
	   * @param {Object} object The object to inspect.
	   * @param {Array} props The source property names to match.
	   * @param {Array} values The source values to match.
	   * @param {Array} strictCompareFlags Strict comparison flags for source values.
	   * @param {Function} [customizer] The function to customize comparing objects.
	   * @returns {boolean} Returns `true` if `object` is a match, else `false`.
	   */
	  function baseIsMatch(object, props, values, strictCompareFlags, customizer) {
	    var length = props.length;
	    if (object == null) {
	      return !length;
	    }
	    var index = -1,
	        noCustomizer = !customizer;

	    while (++index < length) {
	      if ((noCustomizer && strictCompareFlags[index])
	            ? values[index] !== object[props[index]]
	            : !hasOwnProperty.call(object, props[index])
	          ) {
	        return false;
	      }
	    }
	    index = -1;
	    while (++index < length) {
	      var key = props[index];
	      if (noCustomizer && strictCompareFlags[index]) {
	        var result = hasOwnProperty.call(object, key);
	      } else {
	        var objValue = object[key],
	            srcValue = values[index];

	        result = customizer ? customizer(objValue, srcValue, key) : undefined;
	        if (typeof result == 'undefined') {
	          result = baseIsEqual(srcValue, objValue, customizer, true);
	        }
	      }
	      if (!result) {
	        return false;
	      }
	    }
	    return true;
	  }

	  /**
	   * The base implementation of `_.map` without support for callback shorthands
	   * or `this` binding.
	   *
	   * @private
	   * @param {Array|Object|string} collection The collection to iterate over.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @returns {Array} Returns the new mapped array.
	   */
	  function baseMap(collection, iteratee) {
	    var result = [];
	    baseEach(collection, function(value, key, collection) {
	      result.push(iteratee(value, key, collection));
	    });
	    return result;
	  }

	  /**
	   * The base implementation of `_.matches` which does not clone `source`.
	   *
	   * @private
	   * @param {Object} source The object of property values to match.
	   * @returns {Function} Returns the new function.
	   */
	  function baseMatches(source) {
	    var props = keys(source),
	        length = props.length;

	    if (length == 1) {
	      var key = props[0],
	          value = source[key];

	      if (isStrictComparable(value)) {
	        return function(object) {
	          return object != null && object[key] === value && hasOwnProperty.call(object, key);
	        };
	      }
	    }
	    var values = Array(length),
	        strictCompareFlags = Array(length);

	    while (length--) {
	      value = source[props[length]];
	      values[length] = value;
	      strictCompareFlags[length] = isStrictComparable(value);
	    }
	    return function(object) {
	      return baseIsMatch(object, props, values, strictCompareFlags);
	    };
	  }

	  /**
	   * The base implementation of `_.matchesProperty` which does not coerce `key`
	   * to a string.
	   *
	   * @private
	   * @param {string} key The key of the property to get.
	   * @param {*} value The value to compare.
	   * @returns {Function} Returns the new function.
	   */
	  function baseMatchesProperty(key, value) {
	    if (isStrictComparable(value)) {
	      return function(object) {
	        return object != null && object[key] === value;
	      };
	    }
	    return function(object) {
	      return object != null && baseIsEqual(value, object[key], null, true);
	    };
	  }

	  /**
	   * The base implementation of `_.property` which does not coerce `key` to a string.
	   *
	   * @private
	   * @param {string} key The key of the property to get.
	   * @returns {Function} Returns the new function.
	   */
	  function baseProperty(key) {
	    return function(object) {
	      return object == null ? undefined : object[key];
	    };
	  }

	  /**
	   * The base implementation of `setData` without support for hot loop detection.
	   *
	   * @private
	   * @param {Function} func The function to associate metadata with.
	   * @param {*} data The metadata.
	   * @returns {Function} Returns `func`.
	   */
	  var baseSetData = !metaMap ? identity : function(func, data) {
	    metaMap.set(func, data);
	    return func;
	  };

	  /**
	   * The base implementation of `_.values` and `_.valuesIn` which creates an
	   * array of `object` property values corresponding to the property names
	   * returned by `keysFunc`.
	   *
	   * @private
	   * @param {Object} object The object to query.
	   * @param {Array} props The property names to get values for.
	   * @returns {Object} Returns the array of property values.
	   */
	  function baseValues(object, props) {
	    var index = -1,
	        length = props.length,
	        result = Array(length);

	    while (++index < length) {
	      result[index] = object[props[index]];
	    }
	    return result;
	  }

	  /**
	   * Performs a binary search of `array` to determine the index at which `value`
	   * should be inserted into `array` in order to maintain its sort order.
	   *
	   * @private
	   * @param {Array} array The sorted array to inspect.
	   * @param {*} value The value to evaluate.
	   * @param {boolean} [retHighest] Specify returning the highest, instead
	   *  of the lowest, index at which a value should be inserted into `array`.
	   * @returns {number} Returns the index at which `value` should be inserted
	   *  into `array`.
	   */
	  function binaryIndex(array, value, retHighest) {
	    var low = 0,
	        high = array ? array.length : low;

	    if (typeof value == 'number' && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
	      while (low < high) {
	        var mid = (low + high) >>> 1,
	            computed = array[mid];

	        if (retHighest ? (computed <= value) : (computed < value)) {
	          low = mid + 1;
	        } else {
	          high = mid;
	        }
	      }
	      return high;
	    }
	    return binaryIndexBy(array, value, identity, retHighest);
	  }

	  /**
	   * This function is like `binaryIndex` except that it invokes `iteratee` for
	   * `value` and each element of `array` to compute their sort ranking. The
	   * iteratee is invoked with one argument; (value).
	   *
	   * @private
	   * @param {Array} array The sorted array to inspect.
	   * @param {*} value The value to evaluate.
	   * @param {Function} iteratee The function invoked per iteration.
	   * @param {boolean} [retHighest] Specify returning the highest, instead
	   *  of the lowest, index at which a value should be inserted into `array`.
	   * @returns {number} Returns the index at which `value` should be inserted
	   *  into `array`.
	   */
	  function binaryIndexBy(array, value, iteratee, retHighest) {
	    value = iteratee(value);

	    var low = 0,
	        high = array ? array.length : 0,
	        valIsNaN = value !== value,
	        valIsUndef = typeof value == 'undefined';

	    while (low < high) {
	      var mid = floor((low + high) / 2),
	          computed = iteratee(array[mid]),
	          isReflexive = computed === computed;

	      if (valIsNaN) {
	        var setLow = isReflexive || retHighest;
	      } else if (valIsUndef) {
	        setLow = isReflexive && (retHighest || typeof computed != 'undefined');
	      } else {
	        setLow = retHighest ? (computed <= value) : (computed < value);
	      }
	      if (setLow) {
	        low = mid + 1;
	      } else {
	        high = mid;
	      }
	    }
	    return nativeMin(high, MAX_ARRAY_INDEX);
	  }

	  /**
	   * A specialized version of `baseCallback` which only supports `this` binding
	   * and specifying the number of arguments to provide to `func`.
	   *
	   * @private
	   * @param {Function} func The function to bind.
	   * @param {*} thisArg The `this` binding of `func`.
	   * @param {number} [argCount] The number of arguments to provide to `func`.
	   * @returns {Function} Returns the callback.
	   */
	  function bindCallback(func, thisArg, argCount) {
	    if (typeof func != 'function') {
	      return identity;
	    }
	    if (typeof thisArg == 'undefined') {
	      return func;
	    }
	    switch (argCount) {
	      case 1: return function(value) {
	        return func.call(thisArg, value);
	      };
	      case 3: return function(value, index, collection) {
	        return func.call(thisArg, value, index, collection);
	      };
	      case 4: return function(accumulator, value, index, collection) {
	        return func.call(thisArg, accumulator, value, index, collection);
	      };
	      case 5: return function(value, other, key, object, source) {
	        return func.call(thisArg, value, other, key, object, source);
	      };
	    }
	    return function() {
	      return func.apply(thisArg, arguments);
	    };
	  }

	  /**
	   * Creates a clone of the given array buffer.
	   *
	   * @private
	   * @param {ArrayBuffer} buffer The array buffer to clone.
	   * @returns {ArrayBuffer} Returns the cloned array buffer.
	   */
	  function bufferClone(buffer) {
	    return bufferSlice.call(buffer, 0);
	  }
	  if (!bufferSlice) {
	    // PhantomJS has `ArrayBuffer` and `Uint8Array` but not `Float64Array`.
	    bufferClone = !(ArrayBuffer && Uint8Array) ? constant(null) : function(buffer) {
	      var byteLength = buffer.byteLength,
	          floatLength = Float64Array ? floor(byteLength / FLOAT64_BYTES_PER_ELEMENT) : 0,
	          offset = floatLength * FLOAT64_BYTES_PER_ELEMENT,
	          result = new ArrayBuffer(byteLength);

	      if (floatLength) {
	        var view = new Float64Array(result, 0, floatLength);
	        view.set(new Float64Array(buffer, 0, floatLength));
	      }
	      if (byteLength != offset) {
	        view = new Uint8Array(result, offset);
	        view.set(new Uint8Array(buffer, offset));
	      }
	      return result;
	    };
	  }

	  /**
	   * Creates a function that assigns properties of source object(s) to a given
	   * destination object.
	   *
	   * @private
	   * @param {Function} assigner The function to assign values.
	   * @returns {Function} Returns the new assigner function.
	   */
	  function createAssigner(assigner) {
	    return function() {
	      var args = arguments,
	          length = args.length,
	          object = args[0];

	      if (length < 2 || object == null) {
	        return object;
	      }
	      var customizer = args[length - 2],
	          thisArg = args[length - 1],
	          guard = args[3];

	      if (length > 3 && typeof customizer == 'function') {
	        customizer = bindCallback(customizer, thisArg, 5);
	        length -= 2;
	      } else {
	        customizer = (length > 2 && typeof thisArg == 'function') ? thisArg : null;
	        length -= (customizer ? 1 : 0);
	      }
	      if (guard && isIterateeCall(args[1], args[2], guard)) {
	        customizer = length == 3 ? null : customizer;
	        length = 2;
	      }
	      var index = 0;
	      while (++index < length) {
	        var source = args[index];
	        if (source) {
	          assigner(object, source, customizer);
	        }
	      }
	      return object;
	    };
	  }

	  /**
	   * Creates a `Set` cache object to optimize linear searches of large arrays.
	   *
	   * @private
	   * @param {Array} [values] The values to cache.
	   * @returns {null|Object} Returns the new cache object if `Set` is supported, else `null`.
	   */
	  var createCache = !(nativeCreate && Set) ? constant(null) : function(values) {
	    return new SetCache(values);
	  };

	  /**
	   * A specialized version of `baseIsEqualDeep` for arrays with support for
	   * partial deep comparisons.
	   *
	   * @private
	   * @param {Array} array The array to compare.
	   * @param {Array} other The other array to compare.
	   * @param {Function} equalFunc The function to determine equivalents of values.
	   * @param {Function} [customizer] The function to customize comparing arrays.
	   * @param {boolean} [isWhere] Specify performing partial comparisons.
	   * @param {Array} [stackA] Tracks traversed `value` objects.
	   * @param {Array} [stackB] Tracks traversed `other` objects.
	   * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
	   */
	  function equalArrays(array, other, equalFunc, customizer, isWhere, stackA, stackB) {
	    var index = -1,
	        arrLength = array.length,
	        othLength = other.length,
	        result = true;

	    if (arrLength != othLength && !(isWhere && othLength > arrLength)) {
	      return false;
	    }
	    // Deep compare the contents, ignoring non-numeric properties.
	    while (result && ++index < arrLength) {
	      var arrValue = array[index],
	          othValue = other[index];

	      result = undefined;
	      if (customizer) {
	        result = isWhere
	          ? customizer(othValue, arrValue, index)
	          : customizer(arrValue, othValue, index);
	      }
	      if (typeof result == 'undefined') {
	        // Recursively compare arrays (susceptible to call stack limits).
	        if (isWhere) {
	          var othIndex = othLength;
	          while (othIndex--) {
	            othValue = other[othIndex];
	            result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isWhere, stackA, stackB);
	            if (result) {
	              break;
	            }
	          }
	        } else {
	          result = (arrValue && arrValue === othValue) || equalFunc(arrValue, othValue, customizer, isWhere, stackA, stackB);
	        }
	      }
	    }
	    return !!result;
	  }

	  /**
	   * A specialized version of `baseIsEqualDeep` for comparing objects of
	   * the same `toStringTag`.
	   *
	   * **Note:** This function only supports comparing values with tags of
	   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	   *
	   * @private
	   * @param {Object} value The object to compare.
	   * @param {Object} other The other object to compare.
	   * @param {string} tag The `toStringTag` of the objects to compare.
	   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	   */
	  function equalByTag(object, other, tag) {
	    switch (tag) {
	      case boolTag:
	      case dateTag:
	        // Coerce dates and booleans to numbers, dates to milliseconds and booleans
	        // to `1` or `0` treating invalid dates coerced to `NaN` as not equal.
	        return +object == +other;

	      case errorTag:
	        return object.name == other.name && object.message == other.message;

	      case numberTag:
	        // Treat `NaN` vs. `NaN` as equal.
	        return (object != +object)
	          ? other != +other
	          // But, treat `-0` vs. `+0` as not equal.
	          : (object == 0 ? ((1 / object) == (1 / other)) : object == +other);

	      case regexpTag:
	      case stringTag:
	        // Coerce regexes to strings and treat strings primitives and string
	        // objects as equal. See https://es5.github.io/#x15.10.6.4 for more details.
	        return object == (other + '');
	    }
	    return false;
	  }

	  /**
	   * A specialized version of `baseIsEqualDeep` for objects with support for
	   * partial deep comparisons.
	   *
	   * @private
	   * @param {Object} object The object to compare.
	   * @param {Object} other The other object to compare.
	   * @param {Function} equalFunc The function to determine equivalents of values.
	   * @param {Function} [customizer] The function to customize comparing values.
	   * @param {boolean} [isWhere] Specify performing partial comparisons.
	   * @param {Array} [stackA] Tracks traversed `value` objects.
	   * @param {Array} [stackB] Tracks traversed `other` objects.
	   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
	   */
	  function equalObjects(object, other, equalFunc, customizer, isWhere, stackA, stackB) {
	    var objProps = keys(object),
	        objLength = objProps.length,
	        othProps = keys(other),
	        othLength = othProps.length;

	    if (objLength != othLength && !isWhere) {
	      return false;
	    }
	    var hasCtor,
	        index = -1;

	    while (++index < objLength) {
	      var key = objProps[index],
	          result = hasOwnProperty.call(other, key);

	      if (result) {
	        var objValue = object[key],
	            othValue = other[key];

	        result = undefined;
	        if (customizer) {
	          result = isWhere
	            ? customizer(othValue, objValue, key)
	            : customizer(objValue, othValue, key);
	        }
	        if (typeof result == 'undefined') {
	          // Recursively compare objects (susceptible to call stack limits).
	          result = (objValue && objValue === othValue) || equalFunc(objValue, othValue, customizer, isWhere, stackA, stackB);
	        }
	      }
	      if (!result) {
	        return false;
	      }
	      hasCtor || (hasCtor = key == 'constructor');
	    }
	    if (!hasCtor) {
	      var objCtor = object.constructor,
	          othCtor = other.constructor;

	      // Non `Object` object instances with different constructors are not equal.
	      if (objCtor != othCtor &&
	          ('constructor' in object && 'constructor' in other) &&
	          !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
	            typeof othCtor == 'function' && othCtor instanceof othCtor)) {
	        return false;
	      }
	    }
	    return true;
	  }

	  /**
	   * Gets the appropriate "callback" function. If the `_.callback` method is
	   * customized this function returns the custom method, otherwise it returns
	   * the `baseCallback` function. If arguments are provided the chosen function
	   * is invoked with them and its result is returned.
	   *
	   * @private
	   * @returns {Function} Returns the chosen function or its result.
	   */
	  function getCallback(func, thisArg, argCount) {
	    var result = lodash.callback || callback;
	    result = result === callback ? baseCallback : result;
	    return argCount ? result(func, thisArg, argCount) : result;
	  }

	  /**
	   * Gets the appropriate "indexOf" function. If the `_.indexOf` method is
	   * customized this function returns the custom method, otherwise it returns
	   * the `baseIndexOf` function. If arguments are provided the chosen function
	   * is invoked with them and its result is returned.
	   *
	   * @private
	   * @returns {Function|number} Returns the chosen function or its result.
	   */
	  function getIndexOf(collection, target, fromIndex) {
	    var result = lodash.indexOf || indexOf;
	    result = result === indexOf ? baseIndexOf : result;
	    return collection ? result(collection, target, fromIndex) : result;
	  }

	  /**
	   * Initializes an array clone.
	   *
	   * @private
	   * @param {Array} array The array to clone.
	   * @returns {Array} Returns the initialized clone.
	   */
	  function initCloneArray(array) {
	    var length = array.length,
	        result = new array.constructor(length);

	    // Add array properties assigned by `RegExp#exec`.
	    if (length && typeof array[0] == 'string' && hasOwnProperty.call(array, 'index')) {
	      result.index = array.index;
	      result.input = array.input;
	    }
	    return result;
	  }

	  /**
	   * Initializes an object clone.
	   *
	   * @private
	   * @param {Object} object The object to clone.
	   * @returns {Object} Returns the initialized clone.
	   */
	  function initCloneObject(object) {
	    var Ctor = object.constructor;
	    if (!(typeof Ctor == 'function' && Ctor instanceof Ctor)) {
	      Ctor = Object;
	    }
	    return new Ctor;
	  }

	  /**
	   * Initializes an object clone based on its `toStringTag`.
	   *
	   * **Note:** This function only supports cloning values with tags of
	   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
	   *
	   *
	   * @private
	   * @param {Object} object The object to clone.
	   * @param {string} tag The `toStringTag` of the object to clone.
	   * @param {boolean} [isDeep] Specify a deep clone.
	   * @returns {Object} Returns the initialized clone.
	   */
	  function initCloneByTag(object, tag, isDeep) {
	    var Ctor = object.constructor;
	    switch (tag) {
	      case arrayBufferTag:
	        return bufferClone(object);

	      case boolTag:
	      case dateTag:
	        return new Ctor(+object);

	      case float32Tag: case float64Tag:
	      case int8Tag: case int16Tag: case int32Tag:
	      case uint8Tag: case uint8ClampedTag: case uint16Tag: case uint32Tag:
	        // Safari 5 mobile incorrectly has `Object` as the constructor of typed arrays.
	        if (Ctor instanceof Ctor) {
	          Ctor = ctorByTag[tag];
	        }
	        var buffer = object.buffer;
	        return new Ctor(isDeep ? bufferClone(buffer) : buffer, object.byteOffset, object.length);

	      case numberTag:
	      case stringTag:
	        return new Ctor(object);

	      case regexpTag:
	        var result = new Ctor(object.source, reFlags.exec(object));
	        result.lastIndex = object.lastIndex;
	    }
	    return result;
	  }

	  /**
	   * Checks if `func` is eligible for `this` binding.
	   *
	   * @private
	   * @param {Function} func The function to check.
	   * @returns {boolean} Returns `true` if `func` is eligible, else `false`.
	   */
	  function isBindable(func) {
	    var support = lodash.support,
	        result = !(support.funcNames ? func.name : support.funcDecomp);

	    if (!result) {
	      var source = fnToString.call(func);
	      if (!support.funcNames) {
	        result = !reFuncName.test(source);
	      }
	      if (!result) {
	        // Check if `func` references the `this` keyword and store the result.
	        result = reThis.test(source) || isNative(func);
	        baseSetData(func, result);
	      }
	    }
	    return result;
	  }

	  /**
	   * Checks if `value` is a valid array-like index.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
	   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
	   */
	  function isIndex(value, length) {
	    value = +value;
	    length = length == null ? MAX_SAFE_INTEGER : length;
	    return value > -1 && value % 1 == 0 && value < length;
	  }

	  /**
	   * Checks if the provided arguments are from an iteratee call.
	   *
	   * @private
	   * @param {*} value The potential iteratee value argument.
	   * @param {*} index The potential iteratee index or key argument.
	   * @param {*} object The potential iteratee object argument.
	   * @returns {boolean} Returns `true` if the arguments are from an iteratee call, else `false`.
	   */
	  function isIterateeCall(value, index, object) {
	    if (!isObject(object)) {
	      return false;
	    }
	    var type = typeof index;
	    if (type == 'number') {
	      var length = object.length,
	          prereq = isLength(length) && isIndex(index, length);
	    } else {
	      prereq = type == 'string' && index in object;
	    }
	    if (prereq) {
	      var other = object[index];
	      return value === value ? (value === other) : (other !== other);
	    }
	    return false;
	  }

	  /**
	   * Checks if `value` is a valid array-like length.
	   *
	   * **Note:** This function is based on ES `ToLength`. See the
	   * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-tolength)
	   * for more details.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
	   */
	  function isLength(value) {
	    return typeof value == 'number' && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
	  }

	  /**
	   * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
	   *
	   * @private
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` if suitable for strict
	   *  equality comparisons, else `false`.
	   */
	  function isStrictComparable(value) {
	    return value === value && (value === 0 ? ((1 / value) > 0) : !isObject(value));
	  }

	  /**
	   * A specialized version of `_.pick` that picks `object` properties specified
	   * by the `props` array.
	   *
	   * @private
	   * @param {Object} object The source object.
	   * @param {string[]} props The property names to pick.
	   * @returns {Object} Returns the new object.
	   */
	  function pickByArray(object, props) {
	    object = toObject(object);

	    var index = -1,
	        length = props.length,
	        result = {};

	    while (++index < length) {
	      var key = props[index];
	      if (key in object) {
	        result[key] = object[key];
	      }
	    }
	    return result;
	  }

	  /**
	   * A specialized version of `_.pick` that picks `object` properties `predicate`
	   * returns truthy for.
	   *
	   * @private
	   * @param {Object} object The source object.
	   * @param {Function} predicate The function invoked per iteration.
	   * @returns {Object} Returns the new object.
	   */
	  function pickByCallback(object, predicate) {
	    var result = {};
	    baseForIn(object, function(value, key, object) {
	      if (predicate(value, key, object)) {
	        result[key] = value;
	      }
	    });
	    return result;
	  }

	  /**
	   * A fallback implementation of `Object.keys` which creates an array of the
	   * own enumerable property names of `object`.
	   *
	   * @private
	   * @param {Object} object The object to inspect.
	   * @returns {Array} Returns the array of property names.
	   */
	  function shimKeys(object) {
	    var props = keysIn(object),
	        propsLength = props.length,
	        length = propsLength && object.length,
	        support = lodash.support;

	    var allowIndexes = length && isLength(length) &&
	      (isArray(object) || (support.nonEnumStrings && isString(object)) ||
	        (support.nonEnumArgs && isArguments(object)));

	    var index = -1,
	        result = [];

	    while (++index < propsLength) {
	      var key = props[index];
	      if ((allowIndexes && isIndex(key, length)) || hasOwnProperty.call(object, key)) {
	        result.push(key);
	      }
	    }
	    return result;
	  }

	  /**
	   * Converts `value` to an object if it is not one.
	   *
	   * @private
	   * @param {*} value The value to process.
	   * @returns {Object} Returns the object.
	   */
	  function toObject(value) {
	    if (lodash.support.unindexedChars && isString(value)) {
	      var index = -1,
	          length = value.length,
	          result = Object(value);

	      while (++index < length) {
	        result[index] = value.charAt(index);
	      }
	      return result;
	    }
	    return isObject(value) ? value : Object(value);
	  }

	  /*------------------------------------------------------------------------*/

	  /**
	   * Creates an array excluding all values of the provided arrays using
	   * `SameValueZero` for equality comparisons.
	   *
	   * **Note:** `SameValueZero` comparisons are like strict equality comparisons,
	   * e.g. `===`, except that `NaN` matches `NaN`. See the
	   * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
	   * for more details.
	   *
	   * @static
	   * @memberOf _
	   * @category Array
	   * @param {Array} array The array to inspect.
	   * @param {...Array} [values] The arrays of values to exclude.
	   * @returns {Array} Returns the new array of filtered values.
	   * @example
	   *
	   * _.difference([1, 2, 3], [4, 2]);
	   * // => [1, 3]
	   */
	  function difference() {
	    var args = arguments,
	        index = -1,
	        length = args.length;

	    while (++index < length) {
	      var value = args[index];
	      if (isArray(value) || isArguments(value)) {
	        break;
	      }
	    }
	    return baseDifference(value, baseFlatten(args, false, true, ++index));
	  }

	  /**
	   * Gets the index at which the first occurrence of `value` is found in `array`
	   * using `SameValueZero` for equality comparisons. If `fromIndex` is negative,
	   * it is used as the offset from the end of `array`. If `array` is sorted
	   * providing `true` for `fromIndex` performs a faster binary search.
	   *
	   * **Note:** `SameValueZero` comparisons are like strict equality comparisons,
	   * e.g. `===`, except that `NaN` matches `NaN`. See the
	   * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
	   * for more details.
	   *
	   * @static
	   * @memberOf _
	   * @category Array
	   * @param {Array} array The array to search.
	   * @param {*} value The value to search for.
	   * @param {boolean|number} [fromIndex=0] The index to search from or `true`
	   *  to perform a binary search on a sorted array.
	   * @returns {number} Returns the index of the matched value, else `-1`.
	   * @example
	   *
	   * _.indexOf([1, 2, 1, 2], 2);
	   * // => 1
	   *
	   * // using `fromIndex`
	   * _.indexOf([1, 2, 1, 2], 2, 2);
	   * // => 3
	   *
	   * // performing a binary search
	   * _.indexOf([1, 1, 2, 2], 2, true);
	   * // => 2
	   */
	  function indexOf(array, value, fromIndex) {
	    var length = array ? array.length : 0;
	    if (!length) {
	      return -1;
	    }
	    if (typeof fromIndex == 'number') {
	      fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : fromIndex;
	    } else if (fromIndex) {
	      var index = binaryIndex(array, value),
	          other = array[index];

	      if (value === value ? (value === other) : (other !== other)) {
	        return index;
	      }
	      return -1;
	    }
	    return baseIndexOf(array, value, fromIndex || 0);
	  }

	  /**
	   * Creates an array of unique values in all provided arrays using `SameValueZero`
	   * for equality comparisons.
	   *
	   * **Note:** `SameValueZero` comparisons are like strict equality comparisons,
	   * e.g. `===`, except that `NaN` matches `NaN`. See the
	   * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
	   * for more details.
	   *
	   * @static
	   * @memberOf _
	   * @category Array
	   * @param {...Array} [arrays] The arrays to inspect.
	   * @returns {Array} Returns the new array of shared values.
	   * @example
	   * _.intersection([1, 2], [4, 2], [2, 1]);
	   * // => [2]
	   */
	  function intersection() {
	    var args = [],
	        argsIndex = -1,
	        argsLength = arguments.length,
	        caches = [],
	        indexOf = getIndexOf(),
	        isCommon = indexOf == baseIndexOf;

	    while (++argsIndex < argsLength) {
	      var value = arguments[argsIndex];
	      if (isArray(value) || isArguments(value)) {
	        args.push(value);
	        caches.push((isCommon && value.length >= 120) ? createCache(argsIndex && value) : null);
	      }
	    }
	    argsLength = args.length;
	    var array = args[0],
	        index = -1,
	        length = array ? array.length : 0,
	        result = [],
	        seen = caches[0];

	    outer:
	    while (++index < length) {
	      value = array[index];
	      if ((seen ? cacheIndexOf(seen, value) : indexOf(result, value, 0)) < 0) {
	        argsIndex = argsLength;
	        while (--argsIndex) {
	          var cache = caches[argsIndex];
	          if ((cache ? cacheIndexOf(cache, value) : indexOf(args[argsIndex], value, 0)) < 0) {
	            continue outer;
	          }
	        }
	        if (seen) {
	          seen.push(value);
	        }
	        result.push(value);
	      }
	    }
	    return result;
	  }

	  /**
	   * Removes all provided values from `array` using `SameValueZero` for equality
	   * comparisons.
	   *
	   * **Notes:**
	   *  - Unlike `_.without`, this method mutates `array`.
	   *  - `SameValueZero` comparisons are like strict equality comparisons, e.g. `===`,
	   *    except that `NaN` matches `NaN`. See the [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
	   *    for more details.
	   *
	   * @static
	   * @memberOf _
	   * @category Array
	   * @param {Array} array The array to modify.
	   * @param {...*} [values] The values to remove.
	   * @returns {Array} Returns `array`.
	   * @example
	   *
	   * var array = [1, 2, 3, 1, 2, 3];
	   *
	   * _.pull(array, 2, 3);
	   * console.log(array);
	   * // => [1, 1]
	   */
	  function pull() {
	    var args = arguments,
	        array = args[0];

	    if (!(array && array.length)) {
	      return array;
	    }
	    var index = 0,
	        indexOf = getIndexOf(),
	        length = args.length;

	    while (++index < length) {
	      var fromIndex = 0,
	          value = args[index];

	      while ((fromIndex = indexOf(array, value, fromIndex)) > -1) {
	        splice.call(array, fromIndex, 1);
	      }
	    }
	    return array;
	  }

	  /**
	   * Removes all elements from `array` that `predicate` returns truthy for
	   * and returns an array of the removed elements. The predicate is bound to
	   * `thisArg` and invoked with three arguments; (value, index, array).
	   *
	   * If a property name is provided for `predicate` the created `_.property`
	   * style callback returns the property value of the given element.
	   *
	   * If a value is also provided for `thisArg` the created `_.matchesProperty`
	   * style callback returns `true` for elements that have a matching property
	   * value, else `false`.
	   *
	   * If an object is provided for `predicate` the created `_.matches` style
	   * callback returns `true` for elements that have the properties of the given
	   * object, else `false`.
	   *
	   * **Note:** Unlike `_.filter`, this method mutates `array`.
	   *
	   * @static
	   * @memberOf _
	   * @category Array
	   * @param {Array} array The array to modify.
	   * @param {Function|Object|string} [predicate=_.identity] The function invoked
	   *  per iteration.
	   * @param {*} [thisArg] The `this` binding of `predicate`.
	   * @returns {Array} Returns the new array of removed elements.
	   * @example
	   *
	   * var array = [1, 2, 3, 4];
	   * var evens = _.remove(array, function(n) {
	   *   return n % 2 == 0;
	   * });
	   *
	   * console.log(array);
	   * // => [1, 3]
	   *
	   * console.log(evens);
	   * // => [2, 4]
	   */
	  function remove(array, predicate, thisArg) {
	    var index = -1,
	        length = array ? array.length : 0,
	        result = [];

	    predicate = getCallback(predicate, thisArg, 3);
	    while (++index < length) {
	      var value = array[index];
	      if (predicate(value, index, array)) {
	        result.push(value);
	        splice.call(array, index--, 1);
	        length--;
	      }
	    }
	    return result;
	  }

	  /*------------------------------------------------------------------------*/

	  /**
	   * Checks if `predicate` returns truthy for **all** elements of `collection`.
	   * The predicate is bound to `thisArg` and invoked with three arguments;
	   * (value, index|key, collection).
	   *
	   * If a property name is provided for `predicate` the created `_.property`
	   * style callback returns the property value of the given element.
	   *
	   * If a value is also provided for `thisArg` the created `_.matchesProperty`
	   * style callback returns `true` for elements that have a matching property
	   * value, else `false`.
	   *
	   * If an object is provided for `predicate` the created `_.matches` style
	   * callback returns `true` for elements that have the properties of the given
	   * object, else `false`.
	   *
	   * @static
	   * @memberOf _
	   * @alias all
	   * @category Collection
	   * @param {Array|Object|string} collection The collection to iterate over.
	   * @param {Function|Object|string} [predicate=_.identity] The function invoked
	   *  per iteration.
	   * @param {*} [thisArg] The `this` binding of `predicate`.
	   * @returns {boolean} Returns `true` if all elements pass the predicate check,
	   *  else `false`.
	   * @example
	   *
	   * _.every([true, 1, null, 'yes'], Boolean);
	   * // => false
	   *
	   * var users = [
	   *   { 'user': 'barney', 'active': false },
	   *   { 'user': 'fred',   'active': false }
	   * ];
	   *
	   * // using the `_.matches` callback shorthand
	   * _.every(users, { 'user': 'barney', 'active': false });
	   * // => false
	   *
	   * // using the `_.matchesProperty` callback shorthand
	   * _.every(users, 'active', false);
	   * // => true
	   *
	   * // using the `_.property` callback shorthand
	   * _.every(users, 'active');
	   * // => false
	   */
	  function every(collection, predicate, thisArg) {
	    var func = isArray(collection) ? arrayEvery : baseEvery;
	    if (typeof predicate != 'function' || typeof thisArg != 'undefined') {
	      predicate = getCallback(predicate, thisArg, 3);
	    }
	    return func(collection, predicate);
	  }

	  /**
	   * Iterates over elements of `collection`, returning an array of all elements
	   * `predicate` returns truthy for. The predicate is bound to `thisArg` and
	   * invoked with three arguments; (value, index|key, collection).
	   *
	   * If a property name is provided for `predicate` the created `_.property`
	   * style callback returns the property value of the given element.
	   *
	   * If a value is also provided for `thisArg` the created `_.matchesProperty`
	   * style callback returns `true` for elements that have a matching property
	   * value, else `false`.
	   *
	   * If an object is provided for `predicate` the created `_.matches` style
	   * callback returns `true` for elements that have the properties of the given
	   * object, else `false`.
	   *
	   * @static
	   * @memberOf _
	   * @alias select
	   * @category Collection
	   * @param {Array|Object|string} collection The collection to iterate over.
	   * @param {Function|Object|string} [predicate=_.identity] The function invoked
	   *  per iteration.
	   * @param {*} [thisArg] The `this` binding of `predicate`.
	   * @returns {Array} Returns the new filtered array.
	   * @example
	   *
	   * _.filter([4, 5, 6], function(n) {
	   *   return n % 2 == 0;
	   * });
	   * // => [4, 6]
	   *
	   * var users = [
	   *   { 'user': 'barney', 'age': 36, 'active': true },
	   *   { 'user': 'fred',   'age': 40, 'active': false }
	   * ];
	   *
	   * // using the `_.matches` callback shorthand
	   * _.pluck(_.filter(users, { 'age': 36, 'active': true }), 'user');
	   * // => ['barney']
	   *
	   * // using the `_.matchesProperty` callback shorthand
	   * _.pluck(_.filter(users, 'active', false), 'user');
	   * // => ['fred']
	   *
	   * // using the `_.property` callback shorthand
	   * _.pluck(_.filter(users, 'active'), 'user');
	   * // => ['barney']
	   */
	  function filter(collection, predicate, thisArg) {
	    var func = isArray(collection) ? arrayFilter : baseFilter;
	    predicate = getCallback(predicate, thisArg, 3);
	    return func(collection, predicate);
	  }

	  /**
	   * Iterates over elements of `collection` invoking `iteratee` for each element.
	   * The `iteratee` is bound to `thisArg` and invoked with three arguments;
	   * (value, index|key, collection). Iterator functions may exit iteration early
	   * by explicitly returning `false`.
	   *
	   * **Note:** As with other "Collections" methods, objects with a `length` property
	   * are iterated like arrays. To avoid this behavior `_.forIn` or `_.forOwn`
	   * may be used for object iteration.
	   *
	   * @static
	   * @memberOf _
	   * @alias each
	   * @category Collection
	   * @param {Array|Object|string} collection The collection to iterate over.
	   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
	   * @param {*} [thisArg] The `this` binding of `iteratee`.
	   * @returns {Array|Object|string} Returns `collection`.
	   * @example
	   *
	   * _([1, 2]).forEach(function(n) {
	   *   console.log(n);
	   * }).value();
	   * // => logs each value from left to right and returns the array
	   *
	   * _.forEach({ 'a': 1, 'b': 2 }, function(n, key) {
	   *   console.log(n, key);
	   * });
	   * // => logs each value-key pair and returns the object (iteration order is not guaranteed)
	   */
	  function forEach(collection, iteratee, thisArg) {
	    return (typeof iteratee == 'function' && typeof thisArg == 'undefined' && isArray(collection))
	      ? arrayEach(collection, iteratee)
	      : baseEach(collection, bindCallback(iteratee, thisArg, 3));
	  }

	  /**
	   * Checks if `value` is in `collection` using `SameValueZero` for equality
	   * comparisons. If `fromIndex` is negative, it is used as the offset from
	   * the end of `collection`.
	   *
	   * **Note:** `SameValueZero` comparisons are like strict equality comparisons,
	   * e.g. `===`, except that `NaN` matches `NaN`. See the
	   * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-samevaluezero)
	   * for more details.
	   *
	   * @static
	   * @memberOf _
	   * @alias contains, include
	   * @category Collection
	   * @param {Array|Object|string} collection The collection to search.
	   * @param {*} target The value to search for.
	   * @param {number} [fromIndex=0] The index to search from.
	   * @returns {boolean} Returns `true` if a matching element is found, else `false`.
	   * @example
	   *
	   * _.includes([1, 2, 3], 1);
	   * // => true
	   *
	   * _.includes([1, 2, 3], 1, 2);
	   * // => false
	   *
	   * _.includes({ 'user': 'fred', 'age': 40 }, 'fred');
	   * // => true
	   *
	   * _.includes('pebbles', 'eb');
	   * // => true
	   */
	  function includes(collection, target, fromIndex) {
	    var length = collection ? collection.length : 0;
	    if (!isLength(length)) {
	      collection = values(collection);
	      length = collection.length;
	    }
	    if (!length) {
	      return false;
	    }
	    if (typeof fromIndex == 'number') {
	      fromIndex = fromIndex < 0 ? nativeMax(length + fromIndex, 0) : (fromIndex || 0);
	    } else {
	      fromIndex = 0;
	    }
	    return (typeof collection == 'string' || !isArray(collection) && isString(collection))
	      ? (fromIndex < length && collection.indexOf(target, fromIndex) > -1)
	      : (getIndexOf(collection, target, fromIndex) > -1);
	  }

	  /**
	   * Creates an array of values by running each element in `collection` through
	   * `iteratee`. The `iteratee` is bound to `thisArg` and invoked with three
	   * arguments; (value, index|key, collection).
	   *
	   * If a property name is provided for `predicate` the created `_.property`
	   * style callback returns the property value of the given element.
	   *
	   * If a value is also provided for `thisArg` the created `_.matchesProperty`
	   * style callback returns `true` for elements that have a matching property
	   * value, else `false`.
	   *
	   * If an object is provided for `predicate` the created `_.matches` style
	   * callback returns `true` for elements that have the properties of the given
	   * object, else `false`.
	   *
	   * Many lodash methods are guarded to work as interatees for methods like
	   * `_.every`, `_.filter`, `_.map`, `_.mapValues`, `_.reject`, and `_.some`.
	   *
	   * The guarded methods are:
	   * `ary`, `callback`, `chunk`, `clone`, `create`, `curry`, `curryRight`, `drop`,
	   * `dropRight`, `fill`, `flatten`, `invert`, `max`, `min`, `parseInt`, `slice`,
	   * `sortBy`, `take`, `takeRight`, `template`, `trim`, `trimLeft`, `trimRight`,
	   * `trunc`, `random`, `range`, `sample`, `uniq`, and `words`
	   *
	   * @static
	   * @memberOf _
	   * @alias collect
	   * @category Collection
	   * @param {Array|Object|string} collection The collection to iterate over.
	   * @param {Function|Object|string} [iteratee=_.identity] The function invoked
	   *  per iteration.
	   *  create a `_.property` or `_.matches` style callback respectively.
	   * @param {*} [thisArg] The `this` binding of `iteratee`.
	   * @returns {Array} Returns the new mapped array.
	   * @example
	   *
	   * function timesThree(n) {
	   *   return n * 3;
	   * }
	   *
	   * _.map([1, 2], timesThree);
	   * // => [3, 6]
	   *
	   * _.map({ 'a': 1, 'b': 2 }, timesThree);
	   * // => [3, 6] (iteration order is not guaranteed)
	   *
	   * var users = [
	   *   { 'user': 'barney' },
	   *   { 'user': 'fred' }
	   * ];
	   *
	   * // using the `_.property` callback shorthand
	   * _.map(users, 'user');
	   * // => ['barney', 'fred']
	   */
	  function map(collection, iteratee, thisArg) {
	    var func = isArray(collection) ? arrayMap : baseMap;
	    iteratee = getCallback(iteratee, thisArg, 3);
	    return func(collection, iteratee);
	  }

	  /**
	   * Gets the value of `key` from all elements in `collection`.
	   *
	   * @static
	   * @memberOf _
	   * @category Collection
	   * @param {Array|Object|string} collection The collection to iterate over.
	   * @param {string} key The key of the property to pluck.
	   * @returns {Array} Returns the property values.
	   * @example
	   *
	   * var users = [
	   *   { 'user': 'barney', 'age': 36 },
	   *   { 'user': 'fred',   'age': 40 }
	   * ];
	   *
	   * _.pluck(users, 'user');
	   * // => ['barney', 'fred']
	   *
	   * var userIndex = _.indexBy(users, 'user');
	   * _.pluck(userIndex, 'age');
	   * // => [36, 40] (iteration order is not guaranteed)
	   */
	  function pluck(collection, key) {
	    return map(collection, baseProperty(key));
	  }

	  /*------------------------------------------------------------------------*/

	  /**
	   * Creates a clone of `value`. If `isDeep` is `true` nested objects are cloned,
	   * otherwise they are assigned by reference. If `customizer` is provided it is
	   * invoked to produce the cloned values. If `customizer` returns `undefined`
	   * cloning is handled by the method instead. The `customizer` is bound to
	   * `thisArg` and invoked with two argument; (value [, index|key, object]).
	   *
	   * **Note:** This method is loosely based on the structured clone algorithm.
	   * The enumerable properties of `arguments` objects and objects created by
	   * constructors other than `Object` are cloned to plain `Object` objects. An
	   * empty object is returned for uncloneable values such as functions, DOM nodes,
	   * Maps, Sets, and WeakMaps. See the [HTML5 specification](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm)
	   * for more details.
	   *
	   * @static
	   * @memberOf _
	   * @category Lang
	   * @param {*} value The value to clone.
	   * @param {boolean} [isDeep] Specify a deep clone.
	   * @param {Function} [customizer] The function to customize cloning values.
	   * @param {*} [thisArg] The `this` binding of `customizer`.
	   * @returns {*} Returns the cloned value.
	   * @example
	   *
	   * var users = [
	   *   { 'user': 'barney' },
	   *   { 'user': 'fred' }
	   * ];
	   *
	   * var shallow = _.clone(users);
	   * shallow[0] === users[0];
	   * // => true
	   *
	   * var deep = _.clone(users, true);
	   * deep[0] === users[0];
	   * // => false
	   *
	   * // using a customizer callback
	   * var el = _.clone(document.body, function(value) {
	   *   if (_.isElement(value)) {
	   *     return value.cloneNode(false);
	   *   }
	   * });
	   *
	   * el === document.body
	   * // => false
	   * el.nodeName
	   * // => BODY
	   * el.childNodes.length;
	   * // => 0
	   */
	  function clone(value, isDeep, customizer, thisArg) {
	    if (isDeep && typeof isDeep != 'boolean' && isIterateeCall(value, isDeep, customizer)) {
	      isDeep = false;
	    }
	    else if (typeof isDeep == 'function') {
	      thisArg = customizer;
	      customizer = isDeep;
	      isDeep = false;
	    }
	    customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 1);
	    return baseClone(value, isDeep, customizer);
	  }

	  /**
	   * Creates a deep clone of `value`. If `customizer` is provided it is invoked
	   * to produce the cloned values. If `customizer` returns `undefined` cloning
	   * is handled by the method instead. The `customizer` is bound to `thisArg`
	   * and invoked with two argument; (value [, index|key, object]).
	   *
	   * **Note:** This method is loosely based on the structured clone algorithm.
	   * The enumerable properties of `arguments` objects and objects created by
	   * constructors other than `Object` are cloned to plain `Object` objects. An
	   * empty object is returned for uncloneable values such as functions, DOM nodes,
	   * Maps, Sets, and WeakMaps. See the [HTML5 specification](http://www.w3.org/TR/html5/infrastructure.html#internal-structured-cloning-algorithm)
	   * for more details.
	   *
	   * @static
	   * @memberOf _
	   * @category Lang
	   * @param {*} value The value to deep clone.
	   * @param {Function} [customizer] The function to customize cloning values.
	   * @param {*} [thisArg] The `this` binding of `customizer`.
	   * @returns {*} Returns the deep cloned value.
	   * @example
	   *
	   * var users = [
	   *   { 'user': 'barney' },
	   *   { 'user': 'fred' }
	   * ];
	   *
	   * var deep = _.cloneDeep(users);
	   * deep[0] === users[0];
	   * // => false
	   *
	   * // using a customizer callback
	   * var el = _.cloneDeep(document.body, function(value) {
	   *   if (_.isElement(value)) {
	   *     return value.cloneNode(true);
	   *   }
	   * });
	   *
	   * el === document.body
	   * // => false
	   * el.nodeName
	   * // => BODY
	   * el.childNodes.length;
	   * // => 20
	   */
	  function cloneDeep(value, customizer, thisArg) {
	    customizer = typeof customizer == 'function' && bindCallback(customizer, thisArg, 1);
	    return baseClone(value, true, customizer);
	  }

	  /**
	   * Checks if `value` is classified as an `arguments` object.
	   *
	   * @static
	   * @memberOf _
	   * @category Lang
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	   * @example
	   *
	   * _.isArguments(function() { return arguments; }());
	   * // => true
	   *
	   * _.isArguments([1, 2, 3]);
	   * // => false
	   */
	  function isArguments(value) {
	    var length = isObjectLike(value) ? value.length : undefined;
	    return (isLength(length) && objToString.call(value) == argsTag) || false;
	  }
	  // Fallback for environments without a `toStringTag` for `arguments` objects.
	  if (!support.argsTag) {
	    isArguments = function(value) {
	      var length = isObjectLike(value) ? value.length : undefined;
	      return (isLength(length) && hasOwnProperty.call(value, 'callee') &&
	        !propertyIsEnumerable.call(value, 'callee')) || false;
	    };
	  }

	  /**
	   * Checks if `value` is classified as an `Array` object.
	   *
	   * @static
	   * @memberOf _
	   * @category Lang
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	   * @example
	   *
	   * _.isArray([1, 2, 3]);
	   * // => true
	   *
	   * _.isArray(function() { return arguments; }());
	   * // => false
	   */
	  var isArray = nativeIsArray || function(value) {
	    return (isObjectLike(value) && isLength(value.length) && objToString.call(value) == arrayTag) || false;
	  };

	  /**
	   * Checks if `value` is empty. A value is considered empty unless it is an
	   * `arguments` object, array, string, or jQuery-like collection with a length
	   * greater than `0` or an object with own enumerable properties.
	   *
	   * @static
	   * @memberOf _
	   * @category Lang
	   * @param {Array|Object|string} value The value to inspect.
	   * @returns {boolean} Returns `true` if `value` is empty, else `false`.
	   * @example
	   *
	   * _.isEmpty(null);
	   * // => true
	   *
	   * _.isEmpty(true);
	   * // => true
	   *
	   * _.isEmpty(1);
	   * // => true
	   *
	   * _.isEmpty([1, 2, 3]);
	   * // => false
	   *
	   * _.isEmpty({ 'a': 1 });
	   * // => false
	   */
	  function isEmpty(value) {
	    if (value == null) {
	      return true;
	    }
	    var length = value.length;
	    if (isLength(length) && (isArray(value) || isString(value) || isArguments(value) ||
	        (isObjectLike(value) && isFunction(value.splice)))) {
	      return !length;
	    }
	    return !keys(value).length;
	  }

	  /**
	   * Checks if `value` is classified as a `Function` object.
	   *
	   * @static
	   * @memberOf _
	   * @category Lang
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	   * @example
	   *
	   * _.isFunction(_);
	   * // => true
	   *
	   * _.isFunction(/abc/);
	   * // => false
	   */
	  var isFunction = !(baseIsFunction(/x/) || (Uint8Array && !baseIsFunction(Uint8Array))) ? baseIsFunction : function(value) {
	    // The use of `Object#toString` avoids issues with the `typeof` operator
	    // in older versions of Chrome and Safari which return 'function' for regexes
	    // and Safari 8 equivalents which return 'object' for typed array constructors.
	    return objToString.call(value) == funcTag;
	  };

	  /**
	   * Checks if `value` is the language type of `Object`.
	   * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	   *
	   * **Note:** See the [ES5 spec](https://es5.github.io/#x8) for more details.
	   *
	   * @static
	   * @memberOf _
	   * @category Lang
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	   * @example
	   *
	   * _.isObject({});
	   * // => true
	   *
	   * _.isObject([1, 2, 3]);
	   * // => true
	   *
	   * _.isObject(1);
	   * // => false
	   */
	  function isObject(value) {
	    // Avoid a V8 JIT bug in Chrome 19-20.
	    // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	    var type = typeof value;
	    return type == 'function' || (value && type == 'object') || false;
	  }

	  /**
	   * Checks if `value` is a native function.
	   *
	   * @static
	   * @memberOf _
	   * @category Lang
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is a native function, else `false`.
	   * @example
	   *
	   * _.isNative(Array.prototype.push);
	   * // => true
	   *
	   * _.isNative(_);
	   * // => false
	   */
	  function isNative(value) {
	    if (value == null) {
	      return false;
	    }
	    if (objToString.call(value) == funcTag) {
	      return reNative.test(fnToString.call(value));
	    }
	    return (isObjectLike(value) &&
	      (isHostObject(value) ? reNative : reHostCtor).test(value)) || false;
	  }

	  /**
	   * Checks if `value` is classified as a `String` primitive or object.
	   *
	   * @static
	   * @memberOf _
	   * @category Lang
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	   * @example
	   *
	   * _.isString('abc');
	   * // => true
	   *
	   * _.isString(1);
	   * // => false
	   */
	  function isString(value) {
	    return typeof value == 'string' || (isObjectLike(value) && objToString.call(value) == stringTag) || false;
	  }

	  /**
	   * Checks if `value` is classified as a typed array.
	   *
	   * @static
	   * @memberOf _
	   * @category Lang
	   * @param {*} value The value to check.
	   * @returns {boolean} Returns `true` if `value` is correctly classified, else `false`.
	   * @example
	   *
	   * _.isTypedArray(new Uint8Array);
	   * // => true
	   *
	   * _.isTypedArray([]);
	   * // => false
	   */
	  function isTypedArray(value) {
	    return (isObjectLike(value) && isLength(value.length) && typedArrayTags[objToString.call(value)]) || false;
	  }

	  /*------------------------------------------------------------------------*/

	  /**
	   * Assigns own enumerable properties of source object(s) to the destination
	   * object. Subsequent sources overwrite property assignments of previous sources.
	   * If `customizer` is provided it is invoked to produce the assigned values.
	   * The `customizer` is bound to `thisArg` and invoked with five arguments;
	   * (objectValue, sourceValue, key, object, source).
	   *
	   * @static
	   * @memberOf _
	   * @alias extend
	   * @category Object
	   * @param {Object} object The destination object.
	   * @param {...Object} [sources] The source objects.
	   * @param {Function} [customizer] The function to customize assigning values.
	   * @param {*} [thisArg] The `this` binding of `customizer`.
	   * @returns {Object} Returns `object`.
	   * @example
	   *
	   * _.assign({ 'user': 'barney' }, { 'age': 40 }, { 'user': 'fred' });
	   * // => { 'user': 'fred', 'age': 40 }
	   *
	   * // using a customizer callback
	   * var defaults = _.partialRight(_.assign, function(value, other) {
	   *   return typeof value == 'undefined' ? other : value;
	   * });
	   *
	   * defaults({ 'user': 'barney' }, { 'age': 36 }, { 'user': 'fred' });
	   * // => { 'user': 'barney', 'age': 36 }
	   */
	  var assign = createAssigner(baseAssign);

	  /**
	   * Creates an array of the own enumerable property names of `object`.
	   *
	   * **Note:** Non-object values are coerced to objects. See the
	   * [ES spec](https://people.mozilla.org/~jorendorff/es6-draft.html#sec-object.keys)
	   * for more details.
	   *
	   * @static
	   * @memberOf _
	   * @category Object
	   * @param {Object} object The object to inspect.
	   * @returns {Array} Returns the array of property names.
	   * @example
	   *
	   * function Foo() {
	   *   this.a = 1;
	   *   this.b = 2;
	   * }
	   *
	   * Foo.prototype.c = 3;
	   *
	   * _.keys(new Foo);
	   * // => ['a', 'b'] (iteration order is not guaranteed)
	   *
	   * _.keys('hi');
	   * // => ['0', '1']
	   */
	  var keys = !nativeKeys ? shimKeys : function(object) {
	    if (object) {
	      var Ctor = object.constructor,
	          length = object.length;
	    }
	    if ((typeof Ctor == 'function' && Ctor.prototype === object) ||
	        (typeof object == 'function' ? lodash.support.enumPrototypes : (length && isLength(length)))) {
	      return shimKeys(object);
	    }
	    return isObject(object) ? nativeKeys(object) : [];
	  };

	  /**
	   * Creates an array of the own and inherited enumerable property names of `object`.
	   *
	   * **Note:** Non-object values are coerced to objects.
	   *
	   * @static
	   * @memberOf _
	   * @category Object
	   * @param {Object} object The object to inspect.
	   * @returns {Array} Returns the array of property names.
	   * @example
	   *
	   * function Foo() {
	   *   this.a = 1;
	   *   this.b = 2;
	   * }
	   *
	   * Foo.prototype.c = 3;
	   *
	   * _.keysIn(new Foo);
	   * // => ['a', 'b', 'c'] (iteration order is not guaranteed)
	   */
	  function keysIn(object) {
	    if (object == null) {
	      return [];
	    }
	    if (!isObject(object)) {
	      object = Object(object);
	    }
	    var length = object.length,
	        support = lodash.support;

	    length = (length && isLength(length) &&
	      (isArray(object) || (support.nonEnumStrings && isString(object)) ||
	        (support.nonEnumArgs && isArguments(object))) && length) || 0;

	    var Ctor = object.constructor,
	        index = -1,
	        proto = (isFunction(Ctor) && Ctor.prototype) || objectProto,
	        isProto = proto === object,
	        result = Array(length),
	        skipIndexes = length > 0,
	        skipErrorProps = support.enumErrorProps && (object === errorProto || object instanceof Error),
	        skipProto = support.enumPrototypes && isFunction(object);

	    while (++index < length) {
	      result[index] = (index + '');
	    }
	    // lodash skips the `constructor` property when it infers it is iterating
	    // over a `prototype` object because IE < 9 can't set the `[[Enumerable]]`
	    // attribute of an existing property and the `constructor` property of a
	    // prototype defaults to non-enumerable.
	    for (var key in object) {
	      if (!(skipProto && key == 'prototype') &&
	          !(skipErrorProps && (key == 'message' || key == 'name')) &&
	          !(skipIndexes && isIndex(key, length)) &&
	          !(key == 'constructor' && (isProto || !hasOwnProperty.call(object, key)))) {
	        result.push(key);
	      }
	    }
	    if (support.nonEnumShadows && object !== objectProto) {
	      var tag = object === stringProto ? stringTag : (object === errorProto ? errorTag : objToString.call(object)),
	          nonEnums = nonEnumProps[tag] || nonEnumProps[objectTag];

	      if (tag == objectTag) {
	        proto = objectProto;
	      }
	      length = shadowProps.length;
	      while (length--) {
	        key = shadowProps[length];
	        var nonEnum = nonEnums[key];
	        if (!(isProto && nonEnum) &&
	            (nonEnum ? hasOwnProperty.call(object, key) : object[key] !== proto[key])) {
	          result.push(key);
	        }
	      }
	    }
	    return result;
	  }

	  /**
	   * The opposite of `_.pick`; this method creates an object composed of the
	   * own and inherited enumerable properties of `object` that are not omitted.
	   * Property names may be specified as individual arguments or as arrays of
	   * property names. If `predicate` is provided it is invoked for each property
	   * of `object` omitting the properties `predicate` returns truthy for. The
	   * predicate is bound to `thisArg` and invoked with three arguments;
	   * (value, key, object).
	   *
	   * @static
	   * @memberOf _
	   * @category Object
	   * @param {Object} object The source object.
	   * @param {Function|...(string|string[])} [predicate] The function invoked per
	   *  iteration or property names to omit, specified as individual property
	   *  names or arrays of property names.
	   * @param {*} [thisArg] The `this` binding of `predicate`.
	   * @returns {Object} Returns the new object.
	   * @example
	   *
	   * var object = { 'user': 'fred', 'age': 40 };
	   *
	   * _.omit(object, 'age');
	   * // => { 'user': 'fred' }
	   *
	   * _.omit(object, _.isNumber);
	   * // => { 'user': 'fred' }
	   */
	  function omit(object, predicate, thisArg) {
	    if (object == null) {
	      return {};
	    }
	    if (typeof predicate != 'function') {
	      var props = arrayMap(baseFlatten(arguments, false, false, 1), String);
	      return pickByArray(object, baseDifference(keysIn(object), props));
	    }
	    predicate = bindCallback(predicate, thisArg, 3);
	    return pickByCallback(object, function(value, key, object) {
	      return !predicate(value, key, object);
	    });
	  }

	  /**
	   * Creates an array of the own enumerable property values of `object`.
	   *
	   * **Note:** Non-object values are coerced to objects.
	   *
	   * @static
	   * @memberOf _
	   * @category Object
	   * @param {Object} object The object to query.
	   * @returns {Array} Returns the array of property values.
	   * @example
	   *
	   * function Foo() {
	   *   this.a = 1;
	   *   this.b = 2;
	   * }
	   *
	   * Foo.prototype.c = 3;
	   *
	   * _.values(new Foo);
	   * // => [1, 2] (iteration order is not guaranteed)
	   *
	   * _.values('hi');
	   * // => ['h', 'i']
	   */
	  function values(object) {
	    return baseValues(object, keys(object));
	  }

	  /*------------------------------------------------------------------------*/

	  /**
	   * Escapes the `RegExp` special characters "\", "^", "$", ".", "|", "?", "*",
	   * "+", "(", ")", "[", "]", "{" and "}" in `string`.
	   *
	   * @static
	   * @memberOf _
	   * @category String
	   * @param {string} [string=''] The string to escape.
	   * @returns {string} Returns the escaped string.
	   * @example
	   *
	   * _.escapeRegExp('[lodash](https://lodash.com/)');
	   * // => '\[lodash\]\(https://lodash\.com/\)'
	   */
	  function escapeRegExp(string) {
	    string = baseToString(string);
	    return (string && reHasRegExpChars.test(string))
	      ? string.replace(reRegExpChars, '\\$&')
	      : string;
	  }

	  /*------------------------------------------------------------------------*/

	  /**
	   * Creates a function that invokes `func` with the `this` binding of `thisArg`
	   * and arguments of the created function. If `func` is a property name the
	   * created callback returns the property value for a given element. If `func`
	   * is an object the created callback returns `true` for elements that contain
	   * the equivalent object properties, otherwise it returns `false`.
	   *
	   * @static
	   * @memberOf _
	   * @alias iteratee
	   * @category Utility
	   * @param {*} [func=_.identity] The value to convert to a callback.
	   * @param {*} [thisArg] The `this` binding of `func`.
	   * @param- {Object} [guard] Enables use as a callback for functions like `_.map`.
	   * @returns {Function} Returns the callback.
	   * @example
	   *
	   * var users = [
	   *   { 'user': 'barney', 'age': 36 },
	   *   { 'user': 'fred',   'age': 40 }
	   * ];
	   *
	   * // wrap to create custom callback shorthands
	   * _.callback = _.wrap(_.callback, function(callback, func, thisArg) {
	   *   var match = /^(.+?)__([gl]t)(.+)$/.exec(func);
	   *   if (!match) {
	   *     return callback(func, thisArg);
	   *   }
	   *   return function(object) {
	   *     return match[2] == 'gt'
	   *       ? object[match[1]] > match[3]
	   *       : object[match[1]] < match[3];
	   *   };
	   * });
	   *
	   * _.filter(users, 'age__gt36');
	   * // => [{ 'user': 'fred', 'age': 40 }]
	   */
	  function callback(func, thisArg, guard) {
	    if (guard && isIterateeCall(func, thisArg, guard)) {
	      thisArg = null;
	    }
	    return isObjectLike(func)
	      ? matches(func)
	      : baseCallback(func, thisArg);
	  }

	  /**
	   * Creates a function that returns `value`.
	   *
	   * @static
	   * @memberOf _
	   * @category Utility
	   * @param {*} value The value to return from the new function.
	   * @returns {Function} Returns the new function.
	   * @example
	   *
	   * var object = { 'user': 'fred' };
	   * var getter = _.constant(object);
	   *
	   * getter() === object;
	   * // => true
	   */
	  function constant(value) {
	    return function() {
	      return value;
	    };
	  }

	  /**
	   * This method returns the first argument provided to it.
	   *
	   * @static
	   * @memberOf _
	   * @category Utility
	   * @param {*} value Any value.
	   * @returns {*} Returns `value`.
	   * @example
	   *
	   * var object = { 'user': 'fred' };
	   *
	   * _.identity(object) === object;
	   * // => true
	   */
	  function identity(value) {
	    return value;
	  }

	  /**
	   * Creates a function which performs a deep comparison between a given object
	   * and `source`, returning `true` if the given object has equivalent property
	   * values, else `false`.
	   *
	   * **Note:** This method supports comparing arrays, booleans, `Date` objects,
	   * numbers, `Object` objects, regexes, and strings. Objects are compared by
	   * their own, not inherited, enumerable properties. For comparing a single
	   * own or inherited property value see `_.matchesProperty`.
	   *
	   * @static
	   * @memberOf _
	   * @category Utility
	   * @param {Object} source The object of property values to match.
	   * @returns {Function} Returns the new function.
	   * @example
	   *
	   * var users = [
	   *   { 'user': 'barney', 'age': 36, 'active': true },
	   *   { 'user': 'fred',   'age': 40, 'active': false }
	   * ];
	   *
	   * _.filter(users, _.matches({ 'age': 40, 'active': false }));
	   * // => [{ 'user': 'fred', 'age': 40, 'active': false }]
	   */
	  function matches(source) {
	    return baseMatches(baseClone(source, true));
	  }

	  /*------------------------------------------------------------------------*/

	  // Add functions to the `Set` cache.
	  SetCache.prototype.push = cachePush;

	  // Add functions that return wrapped values when chaining.
	  lodash.assign = assign;
	  lodash.callback = callback;
	  lodash.constant = constant;
	  lodash.difference = difference;
	  lodash.filter = filter;
	  lodash.forEach = forEach;
	  lodash.intersection = intersection;
	  lodash.keys = keys;
	  lodash.keysIn = keysIn;
	  lodash.map = map;
	  lodash.matches = matches;
	  lodash.omit = omit;
	  lodash.pluck = pluck;
	  lodash.pull = pull;
	  lodash.remove = remove;
	  lodash.values = values;

	  // Add aliases.
	  lodash.collect = map;
	  lodash.each = forEach;
	  lodash.extend = assign;
	  lodash.iteratee = callback;
	  lodash.select = filter;

	  /*------------------------------------------------------------------------*/

	  // Add functions that return unwrapped values when chaining.
	  lodash.clone = clone;
	  lodash.cloneDeep = cloneDeep;
	  lodash.escapeRegExp = escapeRegExp;
	  lodash.every = every;
	  lodash.identity = identity;
	  lodash.includes = includes;
	  lodash.indexOf = indexOf;
	  lodash.isArguments = isArguments;
	  lodash.isArray = isArray;
	  lodash.isEmpty = isEmpty;
	  lodash.isFunction = isFunction;
	  lodash.isNative = isNative;
	  lodash.isObject = isObject;
	  lodash.isString = isString;
	  lodash.isTypedArray = isTypedArray;

	  // Add aliases.
	  lodash.all = every;
	  lodash.contains = includes;
	  lodash.include = includes;

	  /*------------------------------------------------------------------------*/

	  /**
	   * The semantic version number.
	   *
	   * @static
	   * @memberOf _
	   * @type string
	   */
	  lodash.VERSION = VERSION;

	  /*--------------------------------------------------------------------------*/

	  if (freeExports && freeModule) {
	    // Export for Node.js or RingoJS.
	    if (moduleExports) {
	      (freeModule.exports = lodash)._ = lodash;
	    }
	  }
	}.call(this));

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(13)(module), (function() { return this; }())))

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
	        try {
	          validator.apply(_context, arguments);
	        } catch(e) {
	          valid = false;
	          console.log('An error was thrown in the validator for action "' + actionName + '"');
	        }
	      }

	      if (!valid) {
	        _.forEach(validatorMessages, function(message){
	          console.log(message);
	        });
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

	var _ = __webpack_require__(1);

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

	        var _shouldAddToList = function(dep){
	          return sortedOrder.indexOf(dep) >= 0 || unlisteningDependencies.indexOf(dep) >= 0;
	        };
	        var _removeDependenciesFromWorkingList = function(action){
	          if(_.every(action.after, function(dep){
	            return _shouldAddToList(dep);
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


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }
/******/ ])
});
;