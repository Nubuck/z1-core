import zbx from '@z1/lib-feature-box'

// parts
import { types } from '../types'
import {
  onRouteEnter,
  viewActionParam,
  routingFromAction,
  findViewKey,
} from './muts'

// main
export const configure = zbx.fn((t, a, rx) => (boxName, props = {}) => {
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
  const viewMacros = t.pathOr(null, ['state', 'views'], props)
  const macroCtx = t.pick(
    ['viewKeys', 'params'],
    t.pathOr({}, ['state'], props)
  )
  if (t.isNil(viewMacros)) {
    return {}
  }
  return {
    initial: {
      status: 'init',
      route: {
        path: null,
        action: null,
        key: null,
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
      const safePath = t.eq(path, '/') ? path : `${path.replace('/', '')}/`
      return [
        r(
          safePath,
          'routeHome',
          onRouteEnter(viewMacros, 'view', macroCtx.viewKeys),
          routes.home || defaultRoute
        ),
        r(
          `${safePath}:view`,
          'routeView',
          onRouteEnter(viewMacros, 'view', macroCtx.viewKeys),
          routes.view || defaultRoute
        ),
        r(
          `${safePath}:view/:detail`,
          'routeViewDetail',
          onRouteEnter(viewMacros, 'detail', macroCtx.viewKeys),
          routes.detail || defaultRoute
        ),
        r(
          `${safePath}:view/:detail/:more`,
          'routeViewMore',
          onRouteEnter(viewMacros, 'more', macroCtx.viewKeys),
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
          const event = t.to.paramCase(action.type.replace(`${boxName}/`, ''))
          const activeMacro = viewMacros[state.active.view]
          const activeState = state.views[state.active.view]
          const nextStatus = t.pathOr(
            activeState.status,
            ['payload', 'status'],
            action
          )
          const activeCtx = t.mergeAll([
            activeState,
            {
              event,
              status: nextStatus,
            },
            t.pick(['route', 'params'], state),
            { next: action.payload },
          ])
          const nextData = activeMacro.data(activeCtx)
          const nextForm = activeMacro.form(
            t.isNil(nextData) ? activeCtx : t.merge(activeCtx, nextData)
          )
          const nextModal = activeMacro.modal(
            t.and(t.isNil(nextData), t.isNil(nextForm))
              ? activeCtx
              : t.mergeAll([
                  activeCtx,
                  t.isNil(nextData) ? {} : nextData,
                  t.isNil(nextForm) ? {} : { form: nextForm },
                ])
          )
          return t.mergeAll([
            state,
            {
              views: t.merge(state.views, {
                [state.active.view]: t.omit(
                  ['event', 'next', 'route', 'params'],
                  t.mergeAll([
                    activeCtx,
                    t.isNil(nextData) ? {} : nextData,
                    t.isNil(nextForm) ? {} : { form: nextForm },
                    t.isNil(nextModal) ? {} : { modal: nextModal },
                  ])
                ),
              }),
            },
          ])
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
    guards(g, { actions }) {
      return [
        g(
          [
            actions.routeHome,
            actions.routeView,
            actions.routeViewDetail,
            actions.routeViewMore,
          ],
          ({ action, redirect }, allow, reject) => {
            const viewKey = findViewKey(
              viewActionParam(actions, action),
              routingFromAction(action),
              macroCtx.viewKeys
            )
            if (t.not(t.isNil(viewKey))) {
              allow(action)
            } else {
              reject(
                redirect({
                  type: zbx.routing.notFound,
                  payload: {},
                })
              )
            }
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
          async (context, dispatch, done) => {
            const boxState = t.path([boxName], context.getState())
            const activeState = t.path(
              ['views', boxState.active.view],
              boxState
            )
            const activeMacro = viewMacros[boxState.active.view]
            const [loadError, loadResult] = await a.of(
              activeMacro.load(
                t.mergeAll([
                  context,
                  activeState,
                  {
                    next: t.neq(context.action.type, actions.dataLoad)
                      ? null
                      : context.action.payload,
                  },
                ])
              )
            )
            if (loadError) {
              dispatch(
                mutators.dataLoadComplete({
                  error: loadError,
                  data: null,
                  status: types.status.ready,
                })
              )
            } else if (t.isNil(loadResult)) {
              dispatch(
                mutators.dataLoadComplete({
                  error: null,
                  data: null,
                  status: types.status.ready,
                })
              )
            } else {
              dispatch(
                mutators.dataLoadComplete(
                  t.merge(
                    {
                      error: null,
                      status: types.status.ready,
                    },
                    loadResult
                  )
                )
              )
            }
            done()
          }
        ),
        // form transmit
        fx([actions.formTransmit], async (context, dispatch, done) => {
          done()
        }),
        // routes exit
        // t.globrex(`!(${boxName})*/ROUTING/*`, { extended: true }).regex
        fx([t.globrex('*/ROUTING/*').regex], async (context, dispatch, done) => {
          done()
        }),
        // subscribe
        // fx([], (context, dispatch, done) => {
        //   done()
        // }),
      ]
    },
  }
})
