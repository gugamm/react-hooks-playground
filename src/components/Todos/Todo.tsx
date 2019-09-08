import * as React from 'react'
import { Todo as TodoType } from '../../types'

export interface TodoParams {
  todo: TodoType
}

function TodoComponent({ todo }: TodoParams) {
  return (
    <>
      <label>#{todo.id}: {todo.description} -- ({todo.done ? 'DONE' : 'NOT DONE'})</label>
    </>
  )
}


export const Todo = React.memo(TodoComponent)
