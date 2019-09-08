import * as React from 'react'
import { Todos, TodosFilter } from './components'
import { Todo, TodosFilters } from './types'
import * as api from './services/api'
import { useFetchRequest } from './utils/useFetchRequest'

const initialTodosFilters: TodosFilters = {
  description: ''
}

const filterTodos = (todos: Todo[], filters: TodosFilters) => {
  return todos.filter(todo => {
    return todo.description.includes(filters.description)
  })
}

const getTodo = () => api.getTodo('0')
const getTodos = () => api.getTodos()

function App() {
  const getTodosRequest = useFetchRequest<Todo[]>(getTodos)
  const getTodoRequest = useFetchRequest<Todo | null>(getTodo)
  const [todosFilter, setFilter] = React.useState(initialTodosFilters)

  const handleFilter = (newFilters: TodosFilters) => {
    setFilter(newFilters)
  }

  return (
    <div>
      <TodosFilter onFilter={handleFilter} />
      {
         !getTodosRequest.data || getTodosRequest.loading ? 
          'Loading todos...' : 
          <Todos todos={filterTodos(getTodosRequest.data, todosFilter)} />
      }
      {
        !getTodoRequest.data || getTodoRequest.loading ?
        'Loading todo...' :
        <Todos todos={[getTodoRequest.data]} />
      }
    </div>
  )   
}

export default App
