var _createInfo = function (_app) {

  var _info = function _info (item) {
    if (item === 'stores') {
      console.log(stores);
    } else if (item === 'dispatcher') {
      console.log(_app.dispatcher);
    }
  }

  return function info (){
    var args = Array.prototype.slice.call(arguments);
    _.each(args, _info);
  };
};
