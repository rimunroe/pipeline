TodoMVC = pipeline.createApp()

TodoMVC.createActions
  addItem: (text) -> text:text
  toggleItem: (id) -> id:id
  setFilter: (filter) ->
    if _.isString(filter) then filter:filter else false


TodoMVC.createStore 'todos',
  API:
    getTodos: -> @get('todos')
    getFilter: -> @get('filter')
  actions:
    addItem: ->
      todos = @get('todos')
      todos.push(text:@action.text, complete:false)
      @udpate(todos: todos)


TodoMVC.createAdapter 'route',
  initalize: ->
    window.onPopState = (event) ->
      #TODO set filter based on route data
      fitler = f(event)
      TodoMVC.actions.setFilter(filter)

  stores:
    todos: ->
      filter = @stores.todos.getFilter()
      #TODO:  set route based on filter


