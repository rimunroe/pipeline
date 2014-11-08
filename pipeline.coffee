pipeline =
  createApp: ->
    actionDispatcher: {}
    storeDispatcher: {}
    actions: {}
    stores: {}
    adaptors: {}

    createActions: (actionObject) ->
        _.forEach actionObject, (packager, actionKey) => @createAction actionKey, packager
    createAction: (actionKey, packager) ->
    createStore: (options) ->
    createAdaptor: (options) ->
