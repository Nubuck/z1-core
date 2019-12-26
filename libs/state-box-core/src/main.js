import { fn as Fn } from './fn'
// import { createMutationFactory, createEffectFactory } from './parts'
import { create } from './create'
import { combine } from './combine'
import { store } from './store'

export const stateBoxCore = {
  create,
  combine,
  store,
  // parts: {
  //   createMutationFactory,
  //   createEffectFactory,
  // },
}
export const fn = Fn
export const task = Fn
