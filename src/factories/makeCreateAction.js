pipeline._makeCreateAction = function (_app) {
  return function createAction (actionName, packager){
    if (_app.hasStarted) {
      throw new Error("cannot create new action \"" + actionName + "\". App has already started.");
    }

    var action = function (){
      if (!_app.hasStarted) {
        throw new Error("Action \"" + actionName + "\" attempted to fire before the app was started.");
      } else {
        var payload = packager.apply(null, arguments);
        _app.dispatcher.enqueueAction(actionName, typeof payload === 'object' ? payload : {});
      }
      return payload ? true : false
    };

    action.actionName = actionName

    _app.actions[actionName] = action;

    return action

  };
};
