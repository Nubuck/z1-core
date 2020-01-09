import { fn } from '@z1/lib-feature-box'

// ctx
import { types } from '../types'

// main
export const configure = fn((t, a, rx) => (boxName, props = {}) => {
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
        m(['routeExit'], (state, action) => {
          return state
        }),
        m(['dataChange', 'dataLoad', 'dataLoadComplete'], (state, action) => {
          return state
        }),
        m(
          ['formChange', 'formTransmit', 'formTransmitComplete'],
          (state, action) => {
            // payload: form: string, data: obj
            return state
          }
        ),
        m('modalChange', (state, action) => {
          return state
        }),
        m(['sub', 'unsub'], (state, action) => {
          return state
        }),
      ]
    },
    routes(r) {
      return [
        r(
          path,
          'routeHome',
          (state, action) => {
            // home viewState
            return state
          },
          routes.home || defaultRoute
        ),
        r(
          `${path}/:view`,
          'routeView',
          (state, action) => {
            // :view viewState
           return state
          },
          routes.view || defaultRoute
        ),
        r(
          `${path}/:view/:detail`,
          'routeViewDetail',
          (state, action) => {
            // :detail or :view viewState
            return state
          },
          routes.detail || defaultRoute
        ),
        r(
          `${path}/:view/:detail/:more`,
          'routeViewMore',
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
        fx(
          [
            actions.routeHome,
            actions.routeView,
            actions.routeViewDetail,
            actions.routeViewMore,
            actions.dataLoad,
          ],
          async (ctx, dispatch, done) => {
            done()
          }
        ),
        // form transmit
        fx([actions.formTransmit], async (ctx, dispatch, done) => {
          done()
        }),
        // routes exit
        // t.globrex(`!(${boxName})*/ROUTING/*`, { extended: true }).regex
        fx(
          [t.globrex('*/ROUTING/*').regex],
          async (ctx, dispatch, done) => {
            done()
          }
        ),
        // subscribe
        fx([], (ctx, dispatch, done) => {
          done()
        }),
      ]
    },
  }
})
