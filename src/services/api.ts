import { Todo } from '../types'
import { delay } from '../utils/asyncHelpers'
import uuid from 'uuid/v4'

export interface TodosDb {
  [K : string]: Todo
}

const DEFAULT_API_DELAY = 2000

let todosDb: TodosDb = {
  '0': {
    description: 'Hello There',
    done: false,
    id: '0'
  },
  '1': {
    description: 'Hey There',
    done: false,
    id: '1'
  }
}

export const createTodo = async (todo: Omit<Todo, 'id'>): Promise<Todo> => {
  await delay(DEFAULT_API_DELAY)
  const id = uuid()
  const newTodo = { ...todo, id }
  todosDb = {
    ...todosDb,
    [id]: newTodo
  }
  return newTodo
}

export const updateTodo = async (todoId: string, updateParams: Partial<Omit<Todo, 'id'>>): Promise<Todo> => {
  await delay(DEFAULT_API_DELAY)
  const prevTodo = todosDb[todoId]
  const newTodo = { ...prevTodo, ...updateParams }
  todosDb = {
    ...todosDb,
    [todoId]: newTodo
  }
  return newTodo
}

export const getTodos = async (): Promise<Todo[]> => {
  await delay(DEFAULT_API_DELAY)
  return Object.values(todosDb)
}

export const getTodo = async (todoId: string): Promise<Todo | null> => {
  await delay(DEFAULT_API_DELAY)
  return todosDb[todoId] || null
}
