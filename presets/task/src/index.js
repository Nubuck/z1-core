import { TASK } from './sync'
import { TASK_ASYNC } from './async'

export const task = factory => {
  return factory(TASK, TASK_ASYNC)
}
