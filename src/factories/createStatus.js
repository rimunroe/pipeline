var _ = require('../lib/lodash');

module.exports = function (_app) {

  var _status = function _status (item) {
    if (item === 'stores') {
      console.log(stores);
    } else if (item === 'dispatcher') {
      console.log(_app.dispatcher);
    }
  };

  return function status (){
    var args = (arguments.length >= 1) ? [].prototype.slice.call(arguments) : [];
    _.each(args, _status);
  };
};
