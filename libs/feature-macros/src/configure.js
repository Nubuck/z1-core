import { fn } from '@z1/lib-feature-box'

// ctx
import { types } from './types'

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
  const viewState = t.merge(t.pathOr({}, ['state'], props), { _: null })
  return {
    initial: {
      route: {
        path: null,
        action: null,
      },
      params: {
        view: null,
        detail: null,
        more: null,
      },
      active: {
        param: null,
        view: null,
      },
      views: {},
    },
    mutations(m) {
      return [
        m(['enterRoute', 'exitRoute'], (state, action) => {
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
            // home viewState
            return state
          },
          routes.home || defaultRoute
        ),
        r(
          'routeView',
          `${path}/:view`,
          (state, action) => {
            // :view viewState
            const view = t.pathOr(null, ['payload', 'view'], action)
            const matchedViewState = t.match(t.to.camelCase(view))(viewState)
            if (t.isNil(matchedViewState)) {
              return state
            }
            const nextState = matchedViewState.data({
              event: types.event.routeEnter,
              status: null,
              error: null,
              viewData: {},
              nextData: {},
            })
            return t.isNil(nextState) ? state : nextState
          },
          routes.view || defaultRoute
        ),
        r(
          'routeViewDetail',
          `${path}/:view/:detail`,
          (state, action) => {
            // :detail or :view viewState
            return state
          },
          routes.detail || defaultRoute
        ),
        r(
          'routeViewMore',
          `${path}/:view/:detail/:more`,
          (state, action) => {
            // :more or :detail or :view viewState
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
