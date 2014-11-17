TodoMVC = require './todomvc'

TodoMVC.createView 'TodoFooter',
    render: ->

      {footer, span, string, ul, li, a, button} = React.DOM
      cx = React.addons.classSet

      activeTodoWord = app.Utils.pluralize(@props.count, "item")

      completedCount = @props.completedCount

      activeFilter = @props.activeFilter

      if completedCount > 0
        clearButton = button
          id: "clear-completed"
          onClick: @actions.clearCompleted,
          "Clear completed (#{completedCount})"

      filters = ['all', 'active', 'completed']

      displayFilters = _.map filters, (filter) =>
        li className: 'filter',
          a className: cx(seleted: filter is nowShowing),
            onClick: => @actions.setFilter(filter), "#{filter}"

      footer id:'footer',
        span id:'todo-count',
          strong null, @props.count, " ", activeTodoWord, " left"
        ul id: 'filters', displayFilters
        clearButton
