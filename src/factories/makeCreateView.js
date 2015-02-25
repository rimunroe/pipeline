var _makeCreateView = function (_app) {

  var onChange = function (storeName) {
    var StoreName = storeName.charAt(0).toUpperCase() + storeName.slice(1);
    return "on" + StoreName + "Change";
  };

  var reactMixin = function (storeNames, viewName) {
    return {
      stores: {},
      componentWillMount: function(){
        for (var storeName in storeNames) {
          if (!_app.stores[storeName]) {
            throw new Error("\"" + viewName + "\" tried to subscribe to \"" + storeName + "\", but it didn't exist.  FYI, views must be created after stores.");
          }
          this.stores[storeName] = _app.stores[storeName];
          changeCb = this[onChange(storeName)];
          if (_.isFunction(changeCb)) {
            changeCb();
            _app.dispatcher.registerStoreCallback(storeName, changeCb, viewName);
          } else {
            throw new Error("\"" + viewName + "\" attempted to subscribe to \"" + storeName + "\" but the view did not have a \"" + onChange(storeName) + "\" method.");
          }
        }
      },
      componentWillUnmount: function(){
        for (var storeName in storeNames) {
          changeCb = this[onChange(storeName)];
          if (_.isFunction(changeCb)) {
            _app.dispatcher.unregisterStoreCallback(storeName, changeCb, viewName);
          }
        }
      }
    };
  };

  return function createView (viewName, options) {

    if (_app.hasStarted) {
      throw new Error("cannot create new view \"" + viewName + "\". App has already started.");
    }

    var stores = _.isString(options.stores) ? [options.stores] : options.stores;
    delete options.stores;

    if (storeNames) {
      for (var storeName in StoreNames){
        if (!_.isFunction(options[onChange(storeName)])) {
          console.warn("\"" + viewName + "\" did not have an \"" + onChange(storeName) + "\" function but listens to \"" + storeName + "\".");
        }
      }
      options.mixins = options.mixins || [];
      options.mixins.push(reactMixin(storeNames, viewName));
    }

    options.displayName = viewName.charAt(0).toUpperCase() + viewName.replace( /([A-Z])/g, " $1" ).slice(1);

    options.actions = _app.actions;
    options.views = _app.views;
    options.helpers = _app.helpers;

    var view = React.createFactory(React.createClass(options));

    _app.views[viewName] = view;

    return view;
  };
};
