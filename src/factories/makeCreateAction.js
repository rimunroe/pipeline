var _ = require('lodash');

var errors = require('../errors');

module.exports = function (_app) {
  var isValid = function(validationObject){

  };

  return function createAction (actionName, validator) {
    if (_app.hasStarted) {
      throw new errors.actions.appHasStarted(actionName);
    }

    var action = function (){
      if (_.isFunction(validator)){
        var validationObject = validator.apply(null, arguments);
        var invalidArgs = [];

        _.forEach(validationObject, function(isValidArg, key){
          if (!isValidArg) invalidArgs.push(key);
        });

        if (!_.isEmpty(invalidArgs)){
          throw new errors.action.failedValidation();
        }
      }

      _app.dispatcher.enqueueAction(actionName, arguments);
    };

    action.actionName = actionName;

    _app.actions[actionName] = action;

    return action;

  };
};
