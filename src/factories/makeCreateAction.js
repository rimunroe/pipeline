var _ = require('lodash');

var errors = require('../errors');

module.exports = function (_app) {

  return function createAction (actionName, validator) {
    if (_app.hasStarted) {
      throw new errors.actions.appHasStarted(actionName);
    }

    var action = function () {
      var valid = true;
      var validatorMessages = [];

      if (_.isFunction(validator)) {
        var _context = {
          require: function(isValidArgument, message) {
            if (!isValidArgument){
              valid = false;
              if (message != null) validatorMessages.push(message);
            }
          }
        };
        validator.apply(_context, arguments);
      }

      if (!valid) {
        _.forEach(validatorMessages, function(message){
          console.log(message);
        });
      } else {
        _app.dispatcher.enqueueAction(actionName, arguments);
      }
    };

    action.actionName = actionName;

    _app.actions[actionName] = action;

    return action;

  };
};
