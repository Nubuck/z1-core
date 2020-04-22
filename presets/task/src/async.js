import {
  delay,
  time,
  limit,
  event,
  callback,
  single,
  set,
  list,
  object,
  map,
  failure,
  success,
  result,
  awaited,
  awaitable,
  doThrow,
  swallow,
  ErrorList,
} from './awaiting'
import { TASK } from './sync'
// utils
const of = function to(subject) {
  try {
    return subject.then((result) => [null, result]).catch((err) => [err, null])
  } catch (error) {
    return [error, null]
  }
}
const trampoline = (fn) => async (...args) => {
  let result = await fn(...args)
  while (TASK.isType(result, 'AsyncFunction')) {
    result = await result()
  }
  return result
}
// main
export const TASK_ASYNC = {
  delay,
  time,
  limit,
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
  awaitable,
  doThrow,
  swallow,
  ErrorList,
  of,
  trampoline,
}
