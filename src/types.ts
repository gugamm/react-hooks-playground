export interface Todo {
  id: string,
  description: string,
  done: boolean
}

export enum TodoStatusFilter {
  ALL = 'ALL',
  DONE = 'DONE',
  NOT_DONE = 'NOT_DONE'
}

export interface TodosFilters {
  description: string
}
