import { createOrCompose } from './createOrCompose'
import { combine } from './combine'
import { store } from './store'

export const stateBoxCore = {
  create: createOrCompose,
  combine,
  store,
}

