import { fn } from '@z1/lib-feature-box'

// ctx
import { viewLifecycle } from './context'

// main
export const configure = fn((t, a) => (boxName, props = {}) => {
  const path = t.pathOr('/', ['path'], props)
  const defaultRoute = { authenticate: false }
  const routes = t.pathOr(
    {
      home: defaultRoute,
      view: defaultRoute,
      detail: defaultRoute,
      more: defaultRoute,
    },
    ['routes'],
    props
  )
  const macroProps = t.pathOr({}, ['views'], props)
  return {
    initial: {},
    mutations(m) {
      return [
        m('exitRoute', (state, action) => {
          return state
        }),
        m(['dataChange', 'dataLoad', 'dataLoadComplete'], (state, action) => {
          return state
        }),
        m(
          ['formChange', 'formTransmit', 'formTransmitComplete'],
          (state, action) => {
            return state
          }
        ),
        m('modalChange', (state, action) => {
          return state
        }),
      ]
    },
    routes(r) {
      return [
        r(
          'routeHome',
          path,
          (state, action) => {
            return state
          },
          routes.home || defaultRoute
        ),
        r(
          'routeView',
          `${path}/:view`,
          (state, action) => {
            return state
          },
          routes.view || defaultRoute
        ),
        r(
          'routeViewDetail',
          `${path}/:view/:detail`,
          (state, action) => {
            return state
          },
          routes.detail || defaultRoute
        ),
        r(
          'routeViewDetail',
          `${path}/:view/:detail/:more`,
          (state, action) => {
            return state
          },
          routes.more || defaultRoute
        ),
      ]
    },
    effects(fx, { actions, mutators }) {
      return [
        // routes enter / data load
        fx([], async (ctx, dispatch, done) => {
          done()
        }),
        // form transmit
        fx([], async (ctx, dispatch, done) => {
          done()
        }),
        // routes exit
        fx([], async (ctx, dispatch, done) => {
          done()
        }),
        // subscribe
        fx([], async (ctx, dispatch, done) => {
          done()
        }),
      ]
    },
  }
})
