import * as React from 'react'
import { Todo } from '../../types'
import { Todo as TodoComponent } from './Todo'

export interface TodosProps {
  todos: Todo[]
}

function TodosComponent({ todos }: TodosProps) {
  const todoList = todos.map(todo => <li key={todo.id}><TodoComponent todo={todo} /></li>)

  return (
    <ul>
      {todoList}
    </ul>
  )
}

export const Todos = React.memo(TodosComponent)
