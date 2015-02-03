pipeline._makeCreateView = function (_app) {
  return function createView (viewName, options) {
    if (_app.hasStarted) {
      throw new Error("cannot create new view \"" + viewName + "\". App has already started.");
    }
    options.views = _app.views;
    options.helpers = _app.helpers;
    var view = React.createFactory(React.createClass(options));
    _app.views[viewName] = view;
    return view;
  };
};
