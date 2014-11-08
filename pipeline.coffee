pipeline =
  createApp: ->
    actionDispatcher: {}
    storeDispatcher: {}
    actions: {}
    stores: {}
    adaptors: {}

    createActions: (actionObject) ->
      _.forEach actionObject, (packager, actionKey) => @createAction(actionKey, packager)
    createAction: (actionKey, packager) ->
      @actions[actionKey] = (args...) ->
        payload = packager.apply(null, args)
        if payload isnt false then @actionDispatcher.sendAction(actionKey, payload) else console.log("wtf mate")

    createStore: (options) ->
    createAdaptor: (options) ->
