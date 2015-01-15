pipeline =
  createApp: (options) ->
    _initializers =
      stores: []
      adapters: []

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

    canDispatch = false
    hasStarted = false

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

      registerStoreCallback: (storeKey, adapterKey, callback) ->
        @storeCallbacks[storeKey] ?= []
        @storeCallbacks[storeKey].push
          adapterKey: adapterKey
          callback: callback

      unregisterStoreCallback: (storeKey, callback) ->
        _.remove @storeCallbacks[storeKey], callback

      storeHasChanged: (storeKey) ->
        @changedStores[storeKey] = true

      sendAction: (actionKey, payload) ->
        _send = =>
          canDispatch = true
          @changedStores = {}

          if @actionCallbacks[actionKey]?
            for cb in @actionCallbacks[actionKey] then cb.callback(payload)
          for storeKey, val of @changedStores when @storeCallbacks[storeKey]?
            for cb in @storeCallbacks[storeKey] then cb.callback()

          canDispatch = false

        if canDispatch then _send() else _.defer _send

      runStoreCallbacks: ->
        for storeKey, val of @changedStores when @storeCallbacks[storeKey]?
          for cb in @storeCallbacks[storeKey] then cb.callback()

    actions: {}
    stores: {}

    createActions: (actionObject) ->
      _.forEach actionObject, (packager, actionKey) => @createAction(actionKey, packager)

    createAction: (actionKey, packager) ->
      @actions[actionKey] = (args...) =>
        payload = packager.apply(null, args)
        dispatcher.sendAction(actionKey, if typeof payload is 'object' then payload else {})

    createStore: (key, options) ->
      callbacks = []
      data = {}

      _mutate = (updates, value) ->
        if typeof updates is 'object'
          for key, val of updates then data[key] = val
        else if typeof updates is 'string'
          data[updates] = value

      after =
        if typeof options.after is 'string' then [options.after]
        else if Array.isArray options.after then options.after
        else []

      if key in after then throw new Error "store \"#{key}\" waits for itself"

      reservedKeys = _.intersection(_.keys(options), ['stores', 'key', 'get', 'update'])

      unless _.isEmpty reservedKeys then _.each reservedKeys, (reservedKey) ->
        throw new Error "In \"#{key}\" Store: \"#{reservedKey}\" is a reserved key and cannot be used."

      _context = _.omit options, ['initialize', 'api', 'actions']

      _.each _context, (prop, key) -> if _.isFunction(prop) then _context[key] = prop.bind(_context)

      _trigger = -> dispatcher.storeHasChanged key

      _.extend _context,
        key: key
        api: {}
        get: (key) -> _.clone if key? then data[key] else data
        update: (updates, value) ->
          _mutate updates, value
          _trigger()

      stores = @stores

      store =
        get: (key) -> _.cloneDeep if key? then data[key] else data

      _.forEach options.api, (callback, name) ->
        if name isnt 'get'
          cb = callback.bind(_context)
          _context.api[name] = cb
          store[name] = cb

      _.forEach options.actions, (action, actionKey) ->
        if typeof action is 'function'
          waitFor = after
          callback = action
        else
          if key is action.after or key in action.after
            throw new Error "on action \"#{actionKey}\", store \"#{key}\" waits for itself to update"
          waitFor = _.unique after.concat(action.after)
          callback = action.action

        fn = (payload) ->
          _context.stores = _keyObj waitFor, (key) -> stores[key]
          callback.call _context, payload

        dispatcher.onAction key, actionKey, waitFor, fn

      if _.isFunction(options.initialize)
        _initContext = _.omit _context, ['actions', 'update']
        _initContext.update = _mutate
        _initializers.stores.push options.initialize.bind _initContext

      @stores[key] = store
      return store

    createAdapter: (key, options) ->
      _context =
        key: key
        stores: @stores
        actions: @actions

      for name, property of _.omit options, ['stores', 'initialize']
        if _.isFunction(property) then _context[name] = property.bind(_context)

      for storeKey, callback of options.stores
        dispatcher.registerStoreCallback storeKey, key, callback.bind(_context)

      @contexts.push _context

      if _.isFunction(options.initialize)
        _initializers.adapters.push options.initialize.bind _.omit _context, 'actions'

    contexts: []

    reactMixin: (stores) ->
      if _.isString(stores) then stores = [stores]
      storesObj = {}
      for storeKey in stores then storesObj[storeKey] = @stores[storeKey]

      stores: storesObj
      actions: @actions

      componentDidMount: ->
        for storeKey in stores
          StoreKey = storeKey.charAt(0).toUpperCase() + storeKey.slice(1)
          cb = @["on#{StoreKey}Change"]
          if _.isFunction(cb) then dispatcher.registerStoreCallback storeKey, 'react-view', cb

      componentWillUnmount: ->
        for storeKey in stores
          StoreKey = storeKey.charAt(0).toUpperCase() + storeKey.slice(1)
          cb = @["on#{StoreKey}Change"]
          if _.isFunction(cb) then dispatcher.unregisterStoreCallback storeKey, cb

    start: ->
      unless hasStarted
        _.each _initializers.stores, (init) -> init()
        delete _initializers.stores
        _.each _initializers.adapters, (init) -> init()
        delete _initializers.adapters

        dispatcher.runStoreCallbacks()

        canDispatch = true
        hasStarted = true

        if options? and _.isFunction(options.init) then options.init.call(this)
