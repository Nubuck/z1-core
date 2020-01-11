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
  const viewMacros = t.pathOr({}, ['state'], props)
  if (t.isNil(viewMacros)) {
    return {}
  }
  const viewMacroKeys = t.keys(viewMacros)
  return {
    initial: {
      status: 'init',
      route: {
        path: null,
        action: null,
        key: null,
        prev: {
          path: null,
          action: null,
          key: null,
        },
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
      views: t.mapObjIndexed(macro => {
        return {
          status: types.status.init,
          subbed: false,
          error: null,
          data: t.pathOr({}, ['initial', 'data'], macro),
          form: t.pathOr({}, ['initial', 'form'], macro),
          modal: t.pathOr({}, ['initial', 'modal'], macro),
        }
      }, viewMacros),
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
    guards(g, { actions, mutators }) {
      return [
        g(
          [
            actions.routeHome,
            actions.routeView,
            actions.routeViewDetail,
            actions.routeViewMore,
          ],
          ({ getState, action, redirect }, allow, reject) => {
            allow(action)
          }
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
        fx([t.globrex('*/ROUTING/*').regex], async (ctx, dispatch, done) => {
          done()
        }),
        // subscribe
        fx([], (ctx, dispatch, done) => {
          done()
        }),
      ]
    },
  }
})
