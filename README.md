pipeline
========
Put in data -> alter application state -> read from state.



Design Intent
=============

Pipeline is a framework for creating flux applications.  Flux is a pretty general pattern, and Pipeline is a pretty oppinionated version of it.

It's not built to solve everyone's problems, it's built to see how far the conceptual straightforwardness and declarative nature of flux can be taken.  This means straightforward when writing starting the app, but also straightforward when you, your team, and new people find your code 3 months later and have to figure out what the hell it's doing.  particular parts of pipeline may feel verbose at first, but we assure you, 3-months-from-now-you will be very happy about that mild verbosity.

Pipeline apps are built with three types of objects:  `actions`, `stores`, and `adapters`.

(note:  When referring to React Components as 'just DOM adaptors' is funny to you, you have now groked pipeline.)

The pipeline app should maintain the canonical representation of state for the entire application.   This includes application data, UI state, routing/location state, everything.


#### Pipeline Objects

##### Actions

Actions are functions that pass data into the system.  They have some special properties.

* They can be called from any context.
* They cannot be called while another action is being processed.

##### Stores

Stores are objects that hold the state one logical area of the application.

Properties of Stores:

* Information has exactly 1 way in: they subscribe to actions and process the actions data.
* Information has exactly 1 way out: they expose an API of getter functions that adapters and views can subscribe to.
* Stores broadcast a change event which allows subscribed adaptors to process the new state of the application.
* All store state processing is done syncronously

The secret sauce of stores is that they can delcare that for an action, they must resolve after some other store.  This ensures that if a store calls a getter of another store during its action resulution, then the result is garuanteed to be the new state of that store.

Store change events are triggered only after all stores have resolved, so subscribed adapters and views are garaunteed to get the new state of the applicaion via getters.

##### Adapters

Adapters are how the pipeline app interacts with world outside of pipeline.

* Adapters may subscribe to store change events and then have some effect outside of pipeline
* Adapters may subscribe to external events and then fire actions into the pipeline app


Using Pipeline
==============

Pipeline provides the constructors `createAction()`, `createStore()`, `createAdapter()`, and for conveneince, `createActions()` because it's common to declare many actions and they're small.  They all do what you'd expect them to do.

#### Create your App

```coffee
App = pipeline.createApp()
```

#### Create a Store

```coffee
App.createStore 'myStore',
  after: ['otherStore']
  someInternalProperty: true
  someInteralMethod: ->
    ...
  API:
    aPublicGetter: ->
      ...
    anotherPublicGetter: (args...) ->
      ...
  actions:
    someAction: ->
      @someMethod(@action.something)
```

##### A Basic Store

```coffee
App.createStore 'myStore',
  API:
    aPublicGetter: ->
      ...
  actions:
    someAction: ->
      ...
```

* `API` defines an object where the keys are the names of the getter functions that the store will expose
* 'actions' defines the actions that the stores will respond to and the callback to run for that action

##### Fancier Stuff

```coffee
App.createStore 'anotherStore',
  after: ['myStore']
  someInternalProperty: true
  someInteralMethod: ->
    ...
  API:
    aPublicGetter: ->
      ...
    anotherPublicGetter: (args...) ->
      ...
  actions:
    someAction: ->
      if @someInternalProperty
        @someInternalMethod(@action.something)
    someOtherAction: ['aThirdStore', ->
      ...
    ]
```

* `after` defines an array of stores that must resolve before this stores does
* Individual actions can specify their own specific store dependencies
* any properties not on `API` are internal
* action handler functions will have @action and @stores set in their context.
** @action is the payload of the action passed in
** @stores is an object of the stores that were declared as dependencies
* All methods are bound to a private context

#### Actions

`createAction(name, packagerFunction)`

The packager function converts the arugments passed into the action into an payload object that will be passed into the stores.

```coffee
App.createAction 'someAction', (foo, bar) -> foo:foo, bar:bar
```

The packager can do simple syntatic validation on the arguments, but any symantic or domain logic should live with the subscribed stores.  If an action packager doesn't return an object, then the action will not be passed to the stores.

```coffee
App.createAction 'someAction', (foo, bar) ->
  if foo? and bar? then {foo:foo, bar:bar} else console.log("nah bro")
```

Because actions are small and often declared in groups, `createActions(object)` is provided.

```coffee
App.createActions
 foo: (foo) -> foo:foo
 bar: (bar) -> bar:bar
 nameSpace:
   baz: (baz) -> baz:baz
```
These actions would then be available

```coffee
App.actions.foo()
App.actions.bar()
App.actions.nameSpace.baz()
```

Packager functions may seem slighly redundant (it's basically just the word foo four times in a row) but they provide some subtle benefits.

* a place to do optional syntax checking.
* self docuemnting about the syntax of what object action handlers will be receiving.
* naming of arguments prevents order of args problems (everyone loves setTimeout).


#### Adapters

(These are the biggest difference between pipeline and standard flux)

Adapters are objects that (1) listen to store change events -> (2) reason about the state of the stores -> (3) interact with the outside world if necessary.

Adapters can be bi-diretional, they can also (4) listen to events events outside of your pipeline app -> (5) reason about that event -> (6) send actions into your application if necessary.

examples:

a `historyAdapter` listens to the canonical state for your application in some sort of `locationStore` and pushes to the history when appropriate.  This adaptor would also listen to popstate events and fire navigation actions when the user changes the url.

a 'networkAdapter' listens to the state of a store and makes network calls accordingly.




## Hello World

#### Create a pipeline app
```coffee
HW = pipeline.createApp()
```

#### Create a store
```coffee

```


## Component Reference

Things in Pipeline:
* [App](https://github.com/rimunroe/pipeline/wiki/App)
* [Actions](https://github.com/rimunroe/pipeline/wiki/Actions)
* [Stores](https://github.com/rimunroe/pipeline/wiki/Stores)
* [Adapters](https://github.com/rimunroe/pipeline/wiki/Adapters)
* [Views](https://github.com/rimunroe/pipeline/wiki/Vies)

