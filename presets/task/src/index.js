import { TASK } from './sync'
import { TASK_ASYNC } from './async'

export function task(factory) {
  return factory(TASK, TASK_ASYNC)
}