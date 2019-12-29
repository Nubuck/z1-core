import { stateBoxCore, fn as Fn } from '@z1/lib-state-box-core'
import createNodeLogger from 'redux-node-logger'

// outs
export const stateBox = Fn(t =>
  t.merge(stateBoxCore, {
    store: t.merge(stateBoxCore.store, {
      create(props) {
        return stateBoxCore.store.create(
          t.merge(props, { logger: createNodeLogger() })
        )
      },
    }),
  })
)
export const fn = Fn
export const task = Fn
export default stateBox

