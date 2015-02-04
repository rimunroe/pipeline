var _createDispatcher = function (_app) {

  var _isDependencyMissing = function _isDependencyMissing (actionName) {
    return !_.every(_dispatcher.actionCallbacks[actionName], function (store) {
      return _.every(store.after, function (dependency) {
        return _.find(_dispatcher.actionCallbacks[actionName], function (store) {
          return store.storeName === dependency;
        });
      });
    });
  }

  var _sortDependencies = function _sortDependencies (actionName) {
    var unsorted = _dispatcher.actionCallbacks[actionName]
    var sorted = _.filter(unsorted, function (action) {return _.isEmpty(action.after);});
    if (_.isEmpty(sorted)) {
      throw new Error("Cyclic dependency with action '" + actionName + "'.");
    }
    var sortedOrder = _.pluck(sorted, 'storeName');
    var working = _.difference(unsorted, sorted);

    while(!_.isEmpty(working)) {
      var cyclic = true;

      working.forEach(function (action) {
        if(_.every(action.after, function (dep) {return sortedOrder.indexOf(dep) >= 0;})) {
          cyclic = false;
          sorted.push(action);
          sortedOrder.push(action.storeName);
        }
      });

      if (cyclic) {
        throw new Error("Cyclic dependency");
      }

      working = _.difference(working, sorted);
    }

    _dispatcher.actionCallbacks[actionName] = sorted;
  };


  var _dispatcher = {
    canDispatch: false,
    actionQueue: [],
    actionCallbacks: {},
    storeCallbacks: {},
    changedStores: {},
  };

  _.extend(_dispatcher, {
    initialize: function () {
      for (actionName in _dispatcher.actionCallbacks) {
        if (!_isDependencyMissing(actionName)) {
          _sortDependencies(actionName);
        } else {
          throw new Error("Missing dependency for action \"" + actionName + "\"");
        }
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
      storeCallbacks[storeName].push({
        adapterName: adapterName,
        callback: callback
      });
    },
    unregisterStoreCallback: function (storeName, callback, adapterName) {
      _.remove(_dispatcher.storeCallbacks[storeName], function (cb){
        return cb.callback === callback;
      });
    },
    storeHasChanged: function (storeName) {
      _dispatcher.changedStores[storeName] = true;
    },
    dispatchAction: function (actionName, payload) {
      if (actionCallbacks[actionName] != null) {
        _.forEach(actionCallbacks[actionName], function (cb) {
          cb.callback(payload);
        });
      }
      for (var storeName in _dispatcher.changedStores) {
        if (storeCallbacks[storeName] != null) {
          _.forEach(dispatcher.storeCallbacks[storeName], function (cb) {
            cb.callback();
          });
        }
      }
    },
    dispatchActions: function () {
      _canDispatch = false;

      for (var offset = 0; offset < actionQueue.length; offset++) {
        var actionName = actionQueue[offset].actionName;
        var payload = actionQueue[offset].payload;

        _dispatcher.dispatchAction(actionName, payload);
      }

      _dispatcher.actionQueue = [];
      _dispatcher.canDispatch = true;
    },
    enqueueAction: function (actionName, payload) {
      _dispatcher.actionQueue.push({
        actionName: actionName,
        payload: payload
      });
      if (_canDispatch) {
        _dispatcher.dispatchActions();
      }
    },
    runStoreCallbacks: function () {
      for (var storeName in _dispatcher.changedStores) {
        if (storeCallbacks[storeName] != null) {
          for (var cb in storeCallbacks[storeName]) cb.callback();
        }
      }
    }
  });

  return _dispatcher;
};
