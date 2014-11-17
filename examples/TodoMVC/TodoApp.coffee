TodoMVC = pipeline.createApp()

TodoMVC.createActions
  addItem: (text) -> text:text
  toggleItem: ->
  setFilter: (filter) -> filter:filter

TodoMVC.createStore 'todos',
  API:
    getTodos: -> @get('todos')
    getFilter: -> @get('filter')
  actions:
    addItem: ->
      todos = @get('todos')
      todos.push(text:@action.text, complete:false)
      @udpate(todos: todos)

