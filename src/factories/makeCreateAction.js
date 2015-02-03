pipeline._makeCreateAction = function (_app) {
  return function createAction (actionName, packager){
    if (_app.hasStarted) {
      throw new Error("cannot create new action \"" + actionName + "\". App has already started.");
    }

    _app.actions[actionName] = function (){
      var payload = packager.apply(null, arguments);
      _app.dispatcher.enqueueAction(actionName, typeof payload === 'object' ? payload : {});
    };
  };
};
