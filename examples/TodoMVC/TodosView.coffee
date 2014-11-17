TodoMVC.createView  'Todos',
  mixins: [TodoMVC.ReactMixin('todos')]

  getInitialState: ->
    todos: @stores.todos.getTodos()
    filter: @stores.todos.getFilter()

  onTodosChange: ->
    @setState
      todos: @stores.todos.getTodos()
      filter: @stores.todos.getFilter()

  render: ->
    {header, h1, input, ul, li} = React.DOM

    {todos, filter} = @state

    if filter is 'completed'
      shownTodos = _.filter(todos, (todo) -> todo.completed is true)
    else if filter is 'active'
      shownTodos = _.filter(todos, (todo) -> todo.completed is false)
    else
      shownTodos = todos


    displayTodos = _.map shownTodos, (todo) ->
      TodoItem(todo:todo, key: todo.id)

    activeTodoCount = _.reduce todos, ((total, todo) ->
      if todo.completed is true then total else total + 1), 0

    completedCount = todos.length - activeTodoCount

    if (activeTodoCount || completedCount)
      footer = TodoFooter
        count:activeTodoCount
        completedCount:completedCount
        filter: filter

    if (todos.length)
      main = section id:"main",
        input
          id:"toggle-all"
          type:"checkbox"
          onChange: @toggleAll
          checked: activeTodoCount is 0
        ul id:"todo-list",
          todoItems

    div className: 'not-sure-yet',
      header id:"header"
      h1 {}, "todos"
      input
        ref: "newField"
        id: "new-todo"
        placeholder: "What needs to be done?"
        onKeyDown: @handleNewTodoKeyDown
        autoFocus: true
      main
      footer
