function BadPluginsList(){
  this.message = '"plugins" must be an array or an object.';
  var err = new Error();
  this.stack = err.stack;
}

BadPluginsList.prototype = Object.create(Error.prototype);
BadPluginsList.prototype.name = 'Bad Plugins List';

function NoPluginName(){
  this.message = 'Plugin must be named.';
  var err = new Error();
  this.stack = err.stack;
}

NoPluginName.prototype = Object.create(Error.prototype);
NoPluginName.prototype.name = 'No Plugin Name';

function BadPluginKey(pluginName, badKeys){
  this.message = 'Plugin \"' + pluginName + '\" attempts to overwrite the following keys on app.create: ' + badKeys.join(', ') + '.';
  var err = new Error();
  this.stack = err.stack;
}

BadPluginKey.prototype = Object.create(Error.prototype);
BadPluginKey.prototype.name = 'Bad Plugin Key';

function NoPluginObject(){
  this.message = 'No plugin object supplied.';
  var err = new Error();
  this.stack = err.stack;
}

NoPluginObject.prototype = Object.create(Error.prototype);
NoPluginObject.prototype.name = 'No Plugin Object';

function MissingDependency(actionName){
  this.message = 'Missing dependency for action \"' + actionName + '\".';
  var err = new Error();
  this.stack = err.stack;
}

MissingDependency.prototype = Object.create(Error.prototype);
MissingDependency.prototype.name = 'Missing Dependency';

function CyclicDependency(){
  this.message = 'There is a cyclic dependency in your app.';
  var err = new Error();
  this.stack = err.stack;
}

CyclicDependency.prototype = Object.create(Error.prototype);
CyclicDependency.prototype.name = 'Cyclic Dependency';

function ActionCreatedPostAppStart(actionName){
  this.message = 'Cannot create new action \"' + actionName + '\". App has already started.';
  var err = new Error();
  this.stack = err.stack;
}

ActionCreatedPostAppStart.prototype = Object.create(Error.prototype);
ActionCreatedPostAppStart.prototype.name = 'Action Created Post App Start';

function ActionValidationFailure(actionName){
  this.message = 'Invalid values passed to action \"' + actionName + '\". Aborting dispatch.';
  var err = new Error();
  this.stack = err.stack;
}

ActionValidationFailure.prototype = Object.create(Error.prototype);
ActionValidationFailure.prototype.name = 'Action Validation Failure';

function StoreCreatedPostAppStart(storeName){
  this.message = 'Cannot create new store \"' + storeName + '\". App has already started.';
  var err = new Error();
  this.stack = err.stack;
}

StoreCreatedPostAppStart.prototype = Object.create(Error.prototype);
StoreCreatedPostAppStart.prototype.name = 'Store Created Post-App Start';

function SelfWaitingStore(storeName){
  this.message = 'Store \"' + storeName + '\" waits for itself.';
  var err = new Error();
  this.stack = err.stack;
}

SelfWaitingStore.prototype = Object.create(Error.prototype);
SelfWaitingStore.prototype.name = 'Self Waiting Store';

function StoreUsedBadKeys(storeName, badKey){
  this.message = 'In \"' + storeName + '\" Store: \"' + badKey + '\" is a reserved key and cannot be used.';
  var err = new Error();
  this.stack = err.stack;
}

StoreUsedBadKeys.prototype = Object.create(Error.prototype);
StoreUsedBadKeys.prototype.name = 'Store Used Bad Keys';

function StoreUsedReservedAPIKey(name){
  this.message = 'API key \"' + name + '\" is a reserved key and cannot be used.';
  var err = new Error();
  this.stack = err.stack;
}

StoreUsedReservedAPIKey.prototype = Object.create(Error.prototype);
StoreUsedReservedAPIKey.prototype.name = 'Store Used Reserved API Key';

module.exports = {
  main: {
    badPluginsList: BadPluginsList
  },
  plugins: {
    noName: NoPluginName,
    badKeys: BadPluginKey,
    noPluginObject: NoPluginObject
  },
  dispatcher: {
    missingDependency: MissingDependency,
    cyclicDependency: CyclicDependency
  },
  actions: {
    appHasStarted: ActionCreatedPostAppStart,
    failedValidation: ActionValidationFailure
  },
  stores: {
    appHasStarted: StoreCreatedPostAppStart,
    waitingForSelf: SelfWaitingStore,
    usedBadKeys: StoreUsedBadKeys,
    usedReservedAPIKey: StoreUsedReservedAPIKey
  }
};
