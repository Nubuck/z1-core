import { task as Fn } from '@z1/preset-task'
import { fromEvent, of } from 'rxjs'
import {
  filter,
  tap,
  map,
  switchMap,
  merge,
  takeUntil,
  catchError,
} from 'rxjs/operators'

// main
export const fn = Fn((t, a) => factory =>
  factory(t, a, {
    of,
    fromEvent,
    filter,
    tap,
    map,
    switchMap,
    merge,
    takeUntil,
    catchError,
  })
)
