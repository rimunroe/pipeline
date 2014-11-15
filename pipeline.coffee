_ = require 'lodash'

pipeline =
  createApp: ->
    dispatcher:
      callbacks: {}

      _sortDependencies: (unsorted) ->
        sorted = _.filter unsorted, (action) -> _.isEmpty action.after
        sortedOrder = _.pluck sorted, 'storeKey'
        if _.isEmpty sorted then return false
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

      register: (storeKey, actionKey, after, callback) ->
        unless @callbacks[actionKey]? then @callbacks[actionKey] = []

        unless _.every(after, (dep) => _.find(@callbacks[actionKey], (action) ->
          dep is action.storeKey
        ))
          missingDependency = true

        @callbacks[actionKey].push
          storeKey: storeKey
          after: after or []
          callback: callback

        unless missingDependency
          sortedCallbacks = @_sortDependencies(@callbacks[actionKey])
          if sortedCallbacks is false
            @callbacks[actionKey].pop()
            throw new Error "store \"#{storeKey}\"'s action \"#{actionKey}\" creates a circular dependency"
          else
            @callbacks[actionKey] = sortedCallbacks

      sendAction: (actionKey, payload) ->
        for cb in @callbacks[actionKey] then cb.callback(payload)

    actions: {}
    stores: {}
    adapters: []

    createActions: (actionObject) ->
      _.forEach actionObject, (packager, actionKey) => @createAction(actionKey, packager)

    createAction: (actionKey, packager) ->
      @actions[actionKey] = (args...) =>
        payload = packager.apply(null, args)
        if payload isnt false
          @dispatcher.sendAction(actionKey, payload)
        else console.log("wtf mate")

    createStore: (key, options) ->
      stores = @stores
      callbacks = []
      data = {}

      after =
        if typeof options.after is 'string' then [options.after]
        else if Array.isArray options.after then options.after
        else []

      newStore =
        key: key
        stores: @stores

        trigger: ->
          for obj in callbacks
            obj.callback.call(obj.context)

        get: (key) -> _.cloneDeep if key? then data[key] else data

        update: (updates) ->
          for key, val of updates then data[key] = val
          @trigger()

        register: (callback, context) -> callbacks.push {callback: callback, context: context}
        unregister: (callback, context) -> _.remove callbacks, {callback: callback, context: context}

      for actionKey, callback of options.actions

        @dispatcher.register key, actionKey, after, callback.bind(newStore)

      @stores[key] = newStore
      return newStore

    createAdapter: (options) ->
      app = this
      newAdapter = {}
      for storeKey, callback of options.stores
        @stores[storeKey].register callback, newAdapter

      @adapters.push newAdapter

      return newAdapter
