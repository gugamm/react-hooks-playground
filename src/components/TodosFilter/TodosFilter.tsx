import * as React from 'react'
import { TodosFilters, TodoStatusFilter } from '../../types'

export interface TodosFilterParams {
  onFilter?: (filters: TodosFilters) => void
}

function TodosFilterComponent({ onFilter }: TodosFilterParams) {
  const [description, setDescription] = React.useState('')
  const [doneFilter, setDoneFilter] = React.useState(TodoStatusFilter.ALL)

  const handleChangeDescription = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDescription(event.currentTarget.value)
  }

  const handleChangeDoneFilter = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDoneFilter(event.currentTarget.value as TodoStatusFilter)
  }

  const handleFilter = () => {
    if (onFilter) {
      onFilter({
        description,
        done: doneFilter
      })
    }
  }

  return (
    <div>
      <div>
        <label>
          Description:
          <input value={description} onChange={handleChangeDescription} />
        </label>
        <input type='radio' name='doneFilter' value={TodoStatusFilter.DONE} checked={doneFilter === TodoStatusFilter.DONE} onChange={handleChangeDoneFilter} /> Done
        <input type='radio' name='doneFilter' value={TodoStatusFilter.NOT_DONE} checked={doneFilter === TodoStatusFilter.NOT_DONE} onChange={handleChangeDoneFilter} /> Not Done
        <input type='radio' name='doneFilter' value={TodoStatusFilter.ALL} checked={doneFilter === TodoStatusFilter.ALL} onChange={handleChangeDoneFilter} /> All
      </div>
      <button type='button' onClick={handleFilter}>Filter</button>
      <pre>{JSON.stringify({ description, doneFilter }, null, 2)}</pre>
    </div>
  )
}

export const TodosFilter = React.memo(TodosFilterComponent)
