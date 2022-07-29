import { stateBoxCore, fn as Fn } from '@z1/lib-state-box-core'
import logger from 'redux-logger'

// outs
export const stateBox = Fn(t =>
  t.merge(stateBoxCore, {
    store: t.merge(stateBoxCore.store, {
      create(props) {
        return stateBoxCore.store.create(
          t.merge(props, { logger })
        )
      },
    }),
  })
)
export const fn = Fn
export const task = Fn
export default stateBox