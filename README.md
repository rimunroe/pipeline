# Pipeline
A tiny Flux framework with strong opinions.
## About
Pipeline is a framework for creating applications based on the
[Flux](http://facebook.github.io/flux/) architectural pattern.

Pipeline isn't designed to to solve everyone's problems; its purpose is to see how far the conceptual straightforwardness and declarative nature of Flux can be taken. This means it is straightforward when writing an app, but also straightforward when you, your team, or new people find your code much later and need to figure out what it is doing. Particular parts of Pipeline may feel verbose at first, but the verbosity helps later down the road.

## Parts of a Pipeline app

Pipeline apps are composed of three conceptual components: *actions*, *stores*,
and *adapters*.

### Actions

Actions are the means by which data enters your system.

Actions take arguments and optionally validate them. Their arguments are passed on to the callbacks of stores which listen to them.

An app can only respond to one action at a time. Trying to send a new action while another is still being dispatched will result in the new action being deferred until the current dispatch is ended.

**Important note:** Everything within an action's packager should be synchronous.

### Stores

Stores maintain your application state in one place.

Information has exactly *one* way into a store after the app has started: actions. The only thing that can alter the state of a store is that store itself. After the app has started, the only time the contents of a store can change is during its reaction to an action.

The only public interface with a store is through a `get()` method and any custom getters defined under the `api` option.

Stores can get from other stores within an action callback. This is allowed by specifying that the store must wait for those stores to react to the action. Store evaluation order per-action is sorted ahead of time. If a store does not listen for an action, it should be available to any stores that respond to that action.

**Important note:** All store state mutation must occur synchronously during the response to an action.


### Adapters

Adapters are how a Pipeline app talks to the outside world.

Adapters react to changes in stores they listen to. They may also react to changes that happen external to Pipeline, such as user actions or external API calls.

A view which renders data in response to a store is one type of adapter. Pipeline comes with a mixin for [React](http://facebook.github.io/react/).


## How these things are used

### Actions

An action is created by specifying a *name* and, optionally, a *validator*. The validator is a function which is used to validate the data the action carries.

### Stores

A store is created by specifying a *name* and a set of options. The options include the set of actions a store listens for and the callbacks to run when the corresponding actions are dispatched.

### Adapters

Adapters are created by specifying a name and a set of options. The options include the set of stores an adapter listens to and the callbacks to run when the corresponding stores update themselves.

## Installation

`bower install pipeline` or `npm install pipeline-flux`

## Plugins

Pipeline can be extended through the use of plugins. The [plugins API](docs/plugins.md) is still being fleshed out, but two example plugins have been created already:

 - [pipeline-routing](https://github.com/rimunroe/pipeline-routing) - Routing and navigation with an action, a store, and an adapter.
 - [pipeline-react-views](https://github.com/rimunroe/pipeline-react-views) - Offers a shorthand for making React components which function as adapters.

To use a plugin, pass them in on the options argument when you instantiate the app, like so:

```javascript
var pipeline = require('pipeline-flux');
var routing = require('pipeline-routing');
var views = require('pipeline-react-views');
var react = require('react');

var app = pipeline.createApp({
  plugins: [
    routing,
    views(react)
  ]
});
```
