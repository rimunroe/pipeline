var _ = require('../lib/lodash');

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
        try {
          validator.apply(_context, arguments);
        } catch(e) {
          valid = false;
          console.log('An error was thrown in the validator for action "' + actionName + '"');
        }
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
