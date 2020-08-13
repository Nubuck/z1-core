import z from '@z1/lib-feature-box'

// parts
import { authStatus } from '../fn'

// main
export const mutations = z.fn((t) => () => (m) => {
  return [
    m(['boot', 'connection'], (state, action) => {
      return t.merge(state, { connected: action.payload || false })
    }),
    m('info', (state, action) => {
      return t.merge(state, {
        info: action.payload,
      })
    }),
    m('redirectChange', (state, action) => {
      return t.merge(state, {
        redirectBackTo: action.payload,
      })
    }),
    m('authenticate', (state) => {
      return t.merge(state, {
        authStatus: authStatus.waiting,
        error: null,
      })
    }),
    m('authenticateComplete', (state, action) => {
      return t.merge(state, action.payload)
    }),
    m('logout', (state) => {
      return t.merge(state, {
        authStatus: authStatus.fail,
        user: null,
        error: null,
        redirectBackTo: null,
      })
    }),
  ]
})
