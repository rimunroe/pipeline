var _ = require('lodash');

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
