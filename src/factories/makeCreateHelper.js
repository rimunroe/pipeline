pipeline._makeCreateHelper = function (_app) {
  return function createHelper (helperName, fxn) {
    if (_app.hasStarted) {
      throw new Error("cannot create new helper \"" + helperName + "\". App has already started.");
    }
    var _context = {
      helpers: _app.helpers
    }

    var helper = function (){
      fxn.apply(_context, arguments);
    }

    _app.helpers[helperName] = helper;

    return helper;
  };
};
