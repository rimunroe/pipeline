var _ = require('../lib/lodash');

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
