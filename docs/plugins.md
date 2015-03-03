# Plugin API

## Introduction

In order to reduce boilerplate for certain common uses, pipeline provides a plugin API. This API allows access to pipeline internals such as the dispatcher, and allows adding properties to the `app.create` object.

## Plugin definition

A plugin exports an object to be used under the "plugins" option when creating a pipeline app. The pipeline looks for an object like this

```javascript
{
  name: String,
  factories: Object,
  runHook: Function
}
```
### `name` (required)

This is the name of the plugin. Currently only used for logging errors.

### `factories` (optional)

```javascript
{
  newCreatorMethod: function(app){return function(/*...*/){/*...*/}}
}
```

This is used to define new creator methods on the app object. The keys are the names of the methods to create, and the values are functions which take the app object and return a new creator function.

## Short example of a plugin


This snippet defines a plugin named "randomly named stores", which defines a new creator method `app.create.randomStore` which is used to create a store with a random name. It also defines a run hook, which executes after stores and adapters have run their initialization functions during the app startup process.

```javascript
var examplePlugin = {
  name: "randomly named stores",
  factories: {
    randomStore: function(app){
      return function(options){
        var randomName = Math.random().toString(36).substring(2)
        app.create.store(randomName, options);
      };
    }
  },
  runHook: function(){
    console.log("random name's runhook was evaluated!");
  }
}
```

The usage would be as follows

```javascript
var app = pipeline.createApp({
  plugins: [examplePlugin]
});

app.create.action("foo", function(num){
  return {num: num};
});

app.create.randomStore({
  actions: {
    foo: function(payload){
      console.log("the number is " + payload.num);
    }
  }
});

app.start();
// console will print "random name's runhook was evaluated!"

app.actions.foo(3);
// console will print "the number is 3"
```
