import { fn as Fn } from './fn'
import { createOrCompose } from './createOrCompose'
import { combine } from './combine'
import { store } from './store'

export const stateBoxCore = {
  create: createOrCompose,
  combine,
  store,
}
export const fn = Fn
export const task = Fn
