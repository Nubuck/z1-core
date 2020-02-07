import z from '@z1/lib-feature-box'

// parts
import { types } from '../types'
import {
  nextViewState,
  onRouteEnter,
  viewActionParam,
  routingFromAction,
  findViewKey,
} from './parts'

// main
export const configure = z.fn((t, a) => (boxName, props = {}) => {
  const path = t.atOr(t.to.paramCase(boxName), 'path', props)
  const defaultRoute = { authenticate: false }
  const routes = t.atOr(
    {
      home: defaultRoute,
      view: defaultRoute,
      detail: defaultRoute,
      more: defaultRoute,
    },
    'routes',
    props
  )
  const viewMacros = t.atOr(null, 'state.views', props)
  const macroCtx = t.pick(
    ['viewKeys', 'params', '_shouldSub'],
    t.atOr({}, 'state', props)
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
          reEnter: false,
          subbed: false,
          error: null,
          data: t.atOr({}, 'initial.data', macro),
          form: t.atOr({}, 'initial.form', macro),
          modal: t.atOr(
            {
              open: false,
              type: null,
            },
            'initial.modal',
            macro
          ),
        }
      }, viewMacros),
    },
    routes(r) {
      const safePath = t.eq(path, '/')
        ? path
        : `/${t.replace(/\//g, '', path || '')}`
      return [
        r(
          safePath,
          'routeHome',
          onRouteEnter(viewMacros, 'view', macroCtx.viewKeys),
          routes.home || defaultRoute
        ),
        r(
          `${safePath}/:view`,
          'routeView',
          onRouteEnter(viewMacros, 'view', macroCtx.viewKeys),
          routes.view || defaultRoute
        ),
        r(
          `${safePath}/:view/:detail`,
          'routeViewDetail',
          onRouteEnter(viewMacros, 'detail', macroCtx.viewKeys),
          routes.detail || defaultRoute
        ),
        r(
          `${safePath}/:view/:detail/:more`,
          'routeViewMore',
          onRouteEnter(viewMacros, 'more', macroCtx.viewKeys),
          routes.more || defaultRoute
        ),
      ]
    },
    mutations(m) {
      return [
        m(['routeExit'], (state, action) => {
          const activeExit = t.atOr(null, 'payload.active', action)
          const exitStatus = t.atOr(null, 'payload.status', action)
          if (t.isNil(activeExit)) {
            return t.merge(state, { status: exitStatus })
          }
          const activeMacro = viewMacros[activeExit.view]
          const activeState = state.views[activeExit.view]
          const activeCtx = t.mergeAll([
            activeState,
            {
              event: types.event.routeExit,
            },
            t.pick(['route', 'params'], action.payload),
            { next: null },
          ])
          const nextActiveState = nextViewState(activeMacro, activeCtx)
          return t.mergeAll([
            state,
            {
              status: exitStatus,
              views: t.merge(state.views, {
                [activeExit.view]: nextActiveState,
              }),
            },
          ])
        }),
        m(['dataChange', 'dataLoad', 'dataLoadComplete'], (state, action) => {
          const event = t.to.paramCase(
            t.replace(`${boxName}/`, '', action.type)
          )
          const activeMacro = viewMacros[state.active.view]
          const activeState = state.views[state.active.view]
          const nextStatus = t.atOr(
            activeState.status,
            'payload.status',
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

          const nextActiveState = nextViewState(activeMacro, activeCtx)
          return t.mergeAll([
            state,
            {
              views: t.merge(state.views, {
                [state.active.view]: nextActiveState,
              }),
            },
          ])
        }),
        m(['sub', 'unsub'], (state, action) => {
          const activeView = t.atOr(null, 'payload.view', action)
          if (t.isNil(activeView)) {
            return state
          }
          return t.merge(state, {
            views: t.merge(state.views, {
              [activeView]: t.merge(state.views[activeView], {
                subbed: t.atOr(
                  state.views[activeView].subbed,
                  'payload.subbed',
                  action
                ),
              }),
            }),
          })
        }),
        m(
          ['formChange', 'formTransmit', 'formTransmitComplete'],
          (state, action) => {
            const event = t.to.paramCase(
              t.replace(`${boxName}/`, '', action.type)
            )
            const activeMacro = viewMacros[state.active.view]
            const activeState = state.views[state.active.view]
            const activeCtx = t.mergeAll([
              activeState,
              {
                event,
                status: t.eq(event, types.event.formChange)
                  ? activeState.status
                  : t.eq(event, types.event.formTransmit)
                  ? types.status.loading
                  : types.status.ready,
              },
              t.pick(['route', 'params'], state),
              { next: action.payload },
            ])
            if (t.eq(event, types.event.formChange)) {
              const nextForm = activeMacro.form(activeCtx)
              if (t.isNil(nextForm)) {
                return state
              }
              return t.merge(state, {
                views: t.merge(state.views, {
                  [state.active.view]: t.merge(activeState, {
                    form: t.merge(activeState, nextForm),
                  }),
                }),
              })
            }
            const nextActiveState = nextViewState(activeMacro, activeCtx)
            return t.mergeAll([
              state,
              {
                views: t.merge(state.views, {
                  [state.active.view]: nextActiveState,
                }),
              },
            ])
          }
        ),
        m('modalChange', (state, action) => {
          const activeMacro = viewMacros[state.active.view]
          const activeState = state.views[state.active.view]
          const activeCtx = t.mergeAll([
            activeState,
            {
              event: types.event.modalChange,
            },
            t.pick(['route', 'params'], state),
            { next: action.payload },
          ])
          const nextActiveState = nextViewState(activeMacro, activeCtx)
          return t.mergeAll([
            state,
            {
              views: t.merge(state.views, {
                [state.active.view]: nextActiveState,
              }),
            },
          ])
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
            if (t.notNil(viewKey)) {
              allow(action)
            } else {
              reject(
                redirect({
                  type: z.routing.actions.notFound,
                  payload: {},
                })
              )
            }
          }
        ),
      ]
    },
    effects(fx, { actions, mutators }) {
      const routeActions = t.pick(
        ['routeHome', 'routeView', 'routeViewDetail', 'routeViewMore'],
        actions
      )
      const routeActionTypes = t.values(routeActions)
      const nextFx = [
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
            const boxState = t.at(boxName, context.getState())
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
                  t.pick(['route', 'params'], boxState),
                  {
                    status: types.status.ready,
                    mutators,
                    next: t.neq(context.action.type, actions.dataLoad)
                      ? null
                      : context.action.payload,
                    dispatch,
                  },
                ])
              )
            )
            dispatch(
              mutators.dataLoadComplete(
                t.notNil(loadError)
                  ? { error: loadError, next: null, status: types.status.ready }
                  : t.isNil(loadResult)
                  ? { error: null, next: null, status: types.status.ready }
                  : t.merge(
                      {
                        error: null,
                        status: types.status.ready,
                      },
                      loadResult
                    )
              )
            )
            done()
          }
        ),
        // routes exit
        fx(
          [t.globrex('*/ROUTING/*').regex, z.routing.actions.notFound],
          (context, dispatch, done) => {
            const state = context.getState()
            const prev = state.location.prev
            if (t.not(t.includes(prev.type, routeActionTypes))) {
              done()
            } else {
              const routing = routingFromAction(prev || {}, {
                pathname: ['pathname'],
                type: ['type'],
              })
              const paramType = viewActionParam(actions, prev)
              const viewKey = findViewKey(paramType, routing, macroCtx.viewKeys)
              dispatch(
                mutators.routeExit(
                  t.mergeAll([
                    {
                      status: t.includes(state.location.type, routeActionTypes)
                        ? 'active'
                        : 'inactive',
                      active: {
                        param: t.at('param', viewKey || {}),
                        view: t.at('key', viewKey || {}),
                      },
                    },
                    routing,
                  ])
                )
              )
              done()
            }
          }
        ),
        fx([actions.routeExit], async (context, dispatch, done) => {
          const boxState = t.at(boxName, context.getState())
          const activeView = t.at('action.payload.active.view', context)
          if (t.isNil(activeMacro)) {
            done()
          } else {
            const activeState = t.path(['views', activeView], boxState)
            const activeMacro = viewMacros[activeView]
            if (t.isNil(activeMacro)) {
              done()
            } else {
              await a.of(
                activeMacro.exit(
                  t.mergeAll([
                    context,
                    activeState,
                    t.pick(['route', 'params'], boxState),
                    {
                      status: types.status.ready,
                      mutators,
                      next: context.action.payload,
                      dispatch,
                    },
                  ])
                )
              )
              done()
            }
          }
        }),
        // form transmit
        fx([actions.formTransmit], async (context, dispatch, done) => {
          const boxState = t.at(boxName, context.getState())
          const activeState = t.path(['views', boxState.active.view], boxState)
          const activeMacro = viewMacros[boxState.active.view]
          const [transmitError, transmitResult] = await a.of(
            activeMacro.transmit(
              t.mergeAll([
                context,
                activeState,
                t.pick(['route', 'params'], boxState),
                {
                  status: types.status.ready,
                  mutators,
                  next: context.action.payload,
                  dispatch,
                },
              ])
            )
          )
          dispatch(
            mutators.formTransmitComplete(
              t.notNil(transmitError)
                ? {
                    error: transmitError,
                    next: null,
                    status: types.status.ready,
                  }
                : t.isNil(transmitResult)
                ? { error: null, next: null, status: types.status.ready }
                : t.merge(
                    {
                      error: null,
                      status: types.status.ready,
                    },
                    transmitResult
                  )
            )
          )
          done()
        }),
      ]
      // yield
      return t.neq(macroCtx._shouldSub, true)
        ? nextFx
        : t.concat(nextFx, [
            fx(
              [actions.routeExit, actions.dataLoadComplete],
              ({ getState, action }, dispatch, done) => {
                const state = getState()
                const boxState = state[boxName]
                const mode = t.eq(action.type, actions.routeExit)
                  ? 'unsub'
                  : 'sub'
                const activeView = t.eq(mode, 'unsub')
                  ? t.atOr(null, 'payload.active.view', action)
                  : t.atOr(null, 'active.view', boxState)
                if (t.isNil(activeView)) {
                  done()
                } else {
                  const activeMacro = viewMacros[activeView]
                  const activeState = t.path(['views', activeView], boxState)
                  if (
                    t.allOf([
                      t.eq(activeMacro._shouldSub, false),
                      t.eq(activeState.subbed, false),
                    ])
                  ) {
                    done()
                  } else if (
                    t.allOf([
                      t.eq(action.type, actions.dataLoadComplete),
                      t.eq(activeState.reEnter, true),
                      t.eq(activeState.subbed, true),
                    ])
                  ) {
                    done()
                  } else if (
                    t.allOf([
                      t.eq(action.type, actions.dataLoadComplete),
                      t.eq(activeState.subbed, true),
                    ])
                  ) {
                    done()
                  } else if (
                    t.allOf([
                      t.eq(action.type, actions.routeExit),
                      t.eq(activeState.subbed, false),
                    ])
                  ) {
                    done()
                  } else {
                    dispatch(
                      mutators[mode]({
                        view: activeView,
                        subbed: t.eq(mode, 'sub'),
                      })
                    )
                    done()
                  }
                }
              }
            ),
            fx(
              actions.sub,
              context => {
                const activeView = t.atOr(null, 'action.payload.view', context)
                if (t.isNil(activeView)) {
                  return null
                }
                if (
                  t.isNil(t.pathOr(null, [activeView, 'subscribe'], viewMacros))
                ) {
                  return null
                }
                return viewMacros[activeView].subscribe(
                  t.merge(context, {
                    actions,
                    mutators,
                    view: activeView,
                    name: boxName,
                  })
                )
              },
              {
                cancelType: actions.unsub,
                warnTimeout: 0,
                latest: true,
              }
            ),
          ])
    },
  }
})
