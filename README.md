pipeline
========
Put in data -> alter application state -> read from state.



Getting Moving
==============

Pipeline is a framework for creating flux applications.

Pipeline apps are built with three types of objects:  `actions`, `stores`, and `adaptors`.

Pipeline provides the constructors `createAction()`, `createStore()`, `createAdapter()`, and for conveneince, `createActions()` because it's common to declare many actions and they're small.  They do what you'd expect them todo.

#### Stores

Stores hold the state for some portion of your application.

* They have 1 way in:  subscribing to actions
* They have 1 way out:  they expose a API of getter functions for other objects to call

#### Actions

Actions are functions that pass data into the system.  They are the only way that data enters the stores. They can be called from anywhere, but mostly on DOM events and in network callbacks.

#### Adapters

(These are the biggest difference between pipeline and standard flux)

Adapters are objects that listen to store change events, reason about the state of the stores, and interact with the outside world if necessary.

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
* [App](App)
* [Actions](Actions)
* [Stores](Stores)
* [Adapters](Adapters)
* [Views](Views)

