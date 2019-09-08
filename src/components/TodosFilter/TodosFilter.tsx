import * as React from 'react'
import { TodosFilters, TodoStatusFilter } from '../../types'

export interface TodosFilterParams {
  onFilter?: (filters: TodosFilters) => void
}

function TodosFilterComponent({ onFilter }: TodosFilterParams) {
  const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    if (onFilter) {
      onFilter({
        description: event.currentTarget.value
      })
    }
  }

  return (
    <div>
      <label>
        Description:
        <input onChange={handleInput} />
      </label>
      <input type='radio' name='doneFilter' value={TodoStatusFilter.DONE} /> Done
      <input type='radio' name='doneFilter' value={TodoStatusFilter.NOT_DONE} /> Not Done
      <input type='radio' name='doneFilter' value={TodoStatusFilter.ALL} defaultChecked /> All
    </div>
  )
}

export const TodosFilter = React.memo(TodosFilterComponent)
