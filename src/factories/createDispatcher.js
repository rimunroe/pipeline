var _ = require('../lib/lodash');

var errors = require('../errors');

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
      var cb = _.find(_dispatcher.storeCallbacks[storeName], function (cb){
        return (cb.callback === callback);
      });
      _dispatcher.storeCallbacks[storeName] = _.without(_dispatcher.storeCallbacks[storeName], cb);
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
