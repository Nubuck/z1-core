import {
  event,
  callback,
  awaited,
  single,
  set,
  list,
  object,
  map,
  failure,
  success,
  result,
} from './awaiting'
import { TASK } from './sync'

const of = function to(promise) {
  return promise.then(result => [null, result]).catch(err => [err, null])
}

const trampoline = fn => async (...args) => {
  let result = await fn(...args)
  while (TASK.isType(result, 'function')) {
    result = await result()
  }
  return result
}

export const TASK_ASYNC = {
  event,
  callback,
  awaited,
  single,
  set,
  list,
  object,
  map,
  failure,
  success,
  result,
  of,
  trampoline,
}
