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
  const { data, loading, refetch, called, params, startPolling, stopPolling } = useFetchRequest<Todo[], TodosFilters>(api.getFilteredTodos, {
    params: todosFilter,
    skip: true
  })

  const handleFilter = (newFilters: TodosFilters) => {
    setFilter(newFilters)
    refetch(newFilters)
  }

  React.useEffect(() => {
    setTimeout(() => {
      console.log('START POLLING...')
      startPolling(1000)
    }, 3000)

    setTimeout(() => {
      console.log('STOP POLLING...')
      stopPolling()
    }, 8000)

  // eslint-disable-next-line
  }, [])

  console.log('PARAMS', params)

  return (
    <div>
      <TodosFilter onFilter={handleFilter} />
      {
         !called || loading || !data ? 
          'Loading todos...' : 
          <Todos todos={data} />
      }
    </div>
  )   
}

export default App
