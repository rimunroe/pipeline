var _ = require('lodash');

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
