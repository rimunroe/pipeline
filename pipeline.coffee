_ = require 'lodash'

module.exports =
  createApp: ->
    _keyObj = (array, callback) ->
      obj = {}
      for key in array then obj[key] = callback(key)
      return obj

    _sortDependencies = (unsorted) ->
      sorted = _.filter unsorted, (action) -> _.isEmpty action.after
      if _.isEmpty sorted then return false
      sortedOrder = _.pluck sorted, 'storeKey'
      working = _.difference unsorted, sorted

      until _.isEmpty working
        cyclic = true

        for action in working when _.every(action.after, (dep) -> dep in sortedOrder)
          cyclic = false
          sorted.push action
          sortedOrder.push action.storeKey

        return false if cyclic

        working = _.difference working, sorted

      return sorted

    dispatcher =
      actionCallbacks: {}
      storeCallbacks: {}
      changedStores: {}

      onAction: (storeKey, actionKey, after, callback) ->
        unless @actionCallbacks[actionKey]? then @actionCallbacks[actionKey] = []

        unless _.every(after, (dep) => _.find(@actionCallbacks[actionKey], (action) ->
          dep is action.storeKey
        ))
          missingDependency = true

        @actionCallbacks[actionKey].push
          storeKey: storeKey
          after: after or []
          callback: callback

        unless missingDependency
          sortedCallbacks = _sortDependencies(@actionCallbacks[actionKey])
          if sortedCallbacks is false
            @actionCallbacks[actionKey].pop()
            throw new Error "store \"#{storeKey}\"'s action \"#{actionKey}\" creates a circular dependency"
          else
            @actionCallbacks[actionKey] = sortedCallbacks

      onStoreChange: (storeKey, adapterKey, callback) ->
        @storeCallbacks[storeKey] ?= []
        @storeCallbacks[storeKey].push
          adapterKey: adapterKey
          callback: callback

      storeHasChanged: (storeKey) ->
        @changedStores[storeKey] = true

      sendAction: (actionKey, payload) ->
        @changedStores = {}
        for cb in @actionCallbacks[actionKey] then cb.callback(payload)
        for storeKey, val of @changedStores when @storeCallbacks[storeKey]?
          for cb in @storeCallbacks[storeKey] then cb.callback()

    actions: {}
    stores: {}
    adapters: {}

    createActions: (actionObject) ->
      _.forEach actionObject, (packager, actionKey) => @createAction(actionKey, packager)

    createAction: (actionKey, packager) ->
      @actions[actionKey] = (args...) =>
        payload = packager.apply(null, args)
        if payload isnt false
          dispatcher.sendAction(actionKey, payload)
        else console.log("wtf mate")

    createStore: (key, options) ->
      stores = @stores
      callbacks = []
      data = {}

      after =
        if typeof options.after is 'string' then [options.after]
        else if Array.isArray options.after then options.after
        else []

      if key in after then throw new Error "store \"#{key}\" waits for itself"

      store =
        key: key

        trigger: -> dispatcher.storeHasChanged(@key)

        get: (key) -> _.cloneDeep if key? then data[key] else data

        update: (updates) ->
          for key, val of updates then data[key] = val
          @trigger()

        register: (callback, context) -> callbacks.push {callback: callback, context: context}
        unregister: (callback, context) -> _.remove callbacks, {callback: callback, context: context}

      for actionKey, action of options.actions
        if typeof action is 'function'
          waitFor = after
          callback = action
        else
          if key is action.after or key in action.after
            throw new Error "on action \"#{actionKey}\", store \"#{key}\" waits for itself to update"
          waitFor = _.unique after.concat(action.after)
          callback = action.action

        fn = (payload, options) =>
          store.action = if _.isObject(payload) then payload else {}
          store.stores = _keyObj(waitFor, (key) => @stores[key])
          callback.call store
          store.action = {}

        dispatcher.onAction key, actionKey, waitFor, fn

      @stores[key] = store
      return store

    createAdapter: (key, options) ->
      adapter = key: key
      for storeKey, callback of options.stores
        dispatcher.onStoreChange storeKey, key, callback

      @adapters[key] = adapter

      return adapter
