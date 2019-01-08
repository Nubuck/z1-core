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

const of = function to(promise) {
  return promise
    .then(result => [ null, result ])
    .catch(err => [ err, null ])
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
}
