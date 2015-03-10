# Pipeline API Documentation

## `pipeline.createApp(options)`

Returns a new pipeline app object.

### options

```javascript
{
  initialize: Function, // App initialization function.
  plugins: Array // Plugins to use.
}
```

#### options.initialize

Optional function will be the last initialization function called after invoking app.start().

* `this.actions`: Object containing all the actions.
* `this.stores`: Object containing all stores.

#### options.plugins

This is the set of [plugins](plugins.md) to use with pipeline.

## `app.create.action(name, validator)`

Creates a new action in the app.

### name

A string name for the action. All actions must have different names.

### validator

This function takes the arguments that the action will take and validates them. The validation is done by calling `this.require` in the validation function, passing in some expression which evaluates to a boolean signifying the acceptance of the value (`true`) or its rejection (`false`), as well as a message that will be printed if the first argument to `require` is false.

Example:

```javascript
app.create.action('foo', function(id, name, uncheckedArg){
  this.require(id != null, '"id" is a required argument');
  this.require(typeof name === string, '"name" must be a string');
});
app.start();

app.actions.foo(5, "Eve", "cantaloupe"); // fires normally
app.actions.foo(5, 5); // fails Eve's check and throws an error
```

## `app.create.store(name, options)`

### name

A string name for the store. All stores must have different names.

### options

```javascript
{
  actions: Object, // Actions that the store reacts to.
  after: String || Array, // Store or stores this store waits for.
  api: Object, // Public read functions for the store.
  initialize: Function // Function that will be called when app is initialized.
}
```

#### options.actions

There are two ways a store's reaction to an action can be defined.

```javascript
{
  someAction: Function, // Function that will be invoked when the action 'someAction' is dispatched.
  anotherAction: {
    after: String || Array, // Additional store or stores for this store to wait for when reacting to 'anotherAction'.
    handler: Function // Function that will be invoked when the action 'bar' is dispatched.
  }
}
```
The handler function will have access to the following attributes on its `this`
object (and any additional non-reserved attributes that were defined on the
options object):

* `this.api` Public getters function.
* `this.get` Default getter function.
* `this.update` A function taking one or two arguments. If it receives one
argument, that argument must be an object, and its properties will be merged
with the store's data, overwriting any existing properties with new ones. If two
arguments are supplied, the first will be the string specifying the property to
be updated, and the second will be the value that property will be set to.
* `this.stores` All the stores that have already finished evaluating.

#### options.after

The stores can list additional stores to listen to by using a single string to
specify one store, or an array of strings for one or more stores.

#### options.api

These functions will be available to anything with a reference to the store.

```javascript
{
  somePublicGet: Function // A public getter.
}
```

## `app.create.adapter(name, options)`

### name

A string name for the adapter. All adapters must have different names.

### options

```javascript
{
  initialize: Function, // Function that will be called when app is started.
  stores: Object // Functions to be called in response to stores updating themselves.
}
```

#### options.initialize

Function to be called when the app starts.


#### options.stores

```javascript
{
  someStore: Function // This function will be invoked when 'someStore' updates itself.
}
```

The functions on this object will have access to the following properties on
their `this` objects (and any additional non-reserved attributes that were
defined on the options object):

* `this.stores` All the stores in the app.
* `this.actions` All the actions in the app.
