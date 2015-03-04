module.exports = function (_app) {
  var isValid = function(validationObject){

  };

  return function createAction (actionName, validator) {
    if (_app.hasStarted) {
      throw new Error("cannot create new action \"" + actionName + "\". App has already started.");
    }

    var action = function (){
      var validationObject = validator.apply(null, arguments);
      var invalidArgs = [];

      _.forEach(validationObject, function(isValidArg, key){
        if (!isValidArg) invalidArgs.push(key);
      });

      if (!_.isEmpty(invalidArgs)){
        throw new Error("Invalid values passed to action \"" + actionName + "\" as the following arguments: " + invalidArgs.join(" "));
      }

      _app.dispatcher.enqueueAction(actionName, arguments);
    };

    action.actionName = actionName;

    _app.actions[actionName] = action;

    return action;

  };
};
