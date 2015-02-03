pipeline._createDispatcher = function (_app) {

  var dispatcher = {
    canDispatch: false,
    actionQueue: [],
    actionCallbacks: {},
    storeCallbacks: {},
    changedStores: {}
  }

  dispatcher.initialize = function (){
    for (actionName in actionCallbacks){
      if (!_isDependencyMissing(actionName)) {
        _sortDependencies(actionName);
      } else {
        throw new Error("Missing dependency for action \"" + actionName + "\"");
      }
    }

    function _isDependencyMissing(actionName) {
      return !_.every(actionCallbacks[actionName], function (store) {
        return _.every(store.after, function (dependency){
          return _.find(actionCallbacks[actionName], function (store){
            return store.storeName === dependency;
          });
        });
      });
    };

    function _sortDependencies(actionName){
      var unsorted = dispatcher.actionCallbacks[actionName]
      var sorted = _.filter(unsorted, function (action){return _.isEmpty(action.after);});
      if (_.isEmpty(sorted)) {
        throw new Error("Cyclic dependency");
      }
      var sortedOrder = _.pluck(sorted, 'storeName');
      var working = _.difference(unsorted, sorted);

      while(!_.isEmpty(working)){
        var cyclic = true;

        working.forEach(function (action){
          if(_.every(action.after, function (dep){return sortedOrder.indexOf(dep) >= 0;})){
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

      this.actionCallbacks[actionName] = sorted;
    };
  };

  dispatcher.onAction = function (storeName, actionName, after, callback){
    if(this.actionCallbacks[actionName] == null) dispatcher.actionCallbacks[actionName] = [];

    dispatcher.actionCallbacks[actionName].push({
      storeName: storeName,
      after: after || [],
      callback: callback
    });
  };

  dispatcher.registerStoreCallback = function (storeName, callback, adapterName){
    if(this.storeCallbacks[storeName] == null) this.storeCallbacks[storeName] = [];
    this.storeCallbacks[storeName].push({
      adapterKey: adapterKey,
      callback: callback
    });
  };

  dispatcher.unregisterStoreCallback = function (storeName, callback, adapterName){
    _.remove(this.storeCallbacks[storeName], callback);
  };

  dispatcher.storeHasChanged = function (storeName){
    this.changedStores[storeName] = true;
  };

  dispatcher.dispatchAction = function (actionName, payload){
    if (this.actionCallbacks[actionName] != null) {
      _.forEach(this.actionCallbacks[actionName], function (cb){
        cb.callback(payload);
      });
    }
    for (var storeName in this.changedStores) {
      if (this.storeCallbacks[storeName] != null) {
        _.forEach(dispatcher.storeCallbacks[storeName], function (cb){
          cb.callback();
        });
      }
    }
  };

  dispatcher.dispatchActions = function (){
    this.canDispatch = false;

    var that = this;

    for (var offset = 0; offset < actionQueue.length; offset++) {
      var actionName = actionQueue[offset].actionName;
      var payload = actionQueue[offset].payload;

      this.dispatchAction(actionName, payload);
    }

    actionQueue = [];
    this.canDispatch = true;
  };

  dispatcher.enqueueAction = function (actionName, payload) {
    actionQueue.push({
      actionName: actionName,
      payload: payload
    });
    if (this.canDispatch) {
      this.dispatchActions();
    }
  };

  dispatcher.runStoreCallbacks = function () {
    for (var storeName in this.changedStores) {
      if (this.storeCallbacks[storeName] != null) {
        for (var cb in this.storeCallbacks[storeName]) cb.callback();
      }
    }
  };
  return dispatcher;
};
