var _ = require('lodash');

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
      for (var actionName in _dispatcher.actionCallbacks){
        if (!_isDependencyMissing(actionName)) _sortDependencies(actionName);
        else throw new Error("Missing dependency for action \"" + actionName + "\"");
      }

      function _isDependencyMissing(actionName) {
        return !_.every(_dispatcher.actionCallbacks[actionName], function(store) {
          return _.every(store.after, function(dependency){
            return _.find(_dispatcher.actionCallbacks[actionName], function(store){
              return store.storeName === dependency;
            });
          });
        });
      }

      // TODO make this section less terrible.

      function _sortDependencies(actionName){
        var unsorted = _dispatcher.actionCallbacks[actionName];
        var sorted = _.filter(unsorted, function(action){return _.isEmpty(action.after);});
        if (_.isEmpty(sorted)) throw new Error("Cyclic dependency");
        var sortedOrder = _.pluck(sorted, 'storeName');
        var working = _.difference(unsorted, sorted);

        var cyclic = true;

        var _dependenciesExist = function(dep){return sortedOrder.indexOf(dep) >= 0;};

        var _removeDependenciesFromWorkingList = function(action){
          if(_.every(action.after, _dependenciesExist)){
            cyclic = false;
            sorted.push(action);
            sortedOrder.push(action.storeName);
          }
        };

        while(!_.isEmpty(working)){
          cyclic = true;

          working.forEach(_removeDependenciesFromWorkingList);

          if(cyclic) throw new Error("Cyclic dependency");

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
        return (cb.callback === callback) && (cb.adapterName === adapterName);
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
            cb.callback();
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
