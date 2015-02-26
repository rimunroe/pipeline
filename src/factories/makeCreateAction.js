module.exports = function (_app) {
  return function createAction (actionName, packager) {
    if (_app.hasStarted) {
      throw new Error("cannot create new action \"" + actionName + "\". App has already started.");
    }

    var action = function (){
      var payload = packager.apply(null, arguments);
      _app.dispatcher.enqueueAction(actionName, typeof payload === 'object' ? payload : {});
      return payload ? true : false;
    };

    action.actionName = actionName;

    _app.actions[actionName] = action;

    return action;

  };
};
