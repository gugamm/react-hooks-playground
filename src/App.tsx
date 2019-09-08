import * as React from 'react'
import { Todos, TodosFilter } from './components'
import { Todo, TodosFilters, TodoStatusFilter } from './types'
import * as api from './services/api'
import { useFetchRequest } from './utils/useFetchRequest'

const initialTodosFilters: TodosFilters = {
  description: '',
  done: TodoStatusFilter.ALL
}

function App() {
  const [todosFilter, setFilter] = React.useState(initialTodosFilters)
  const getFilteredTodosRequest = useFetchRequest<Todo[]>(api.getFilteredTodos, todosFilter)

  const handleFilter = (newFilters: TodosFilters) => {
    setFilter(newFilters)
  }

  return (
    <div>
      <TodosFilter onFilter={handleFilter} />
      {
         !getFilteredTodosRequest.data || getFilteredTodosRequest.loading ? 
          'Loading todos...' : 
          <Todos todos={getFilteredTodosRequest.data} />
      }
    </div>
  )   
}

export default App
