import { task, VIEW_STATUS } from '@z1/lib-feature-box'

// tasks
import {
  VIEW_LIFECYCLE,
  nextInitState,
  nextRouteState,
  nextRouteExitState,
  nextViewState,
  nextFormState,
  matchBoxRoutes,
  matchNotBoxRoutes,
} from './tasks'

// main
export const macroRouteViewState = task(
  (t, a) => (boxName = 'box', props = {}) => {
    const path = t.pathOr('/', ['path'], props)
    const defaultRouteProps = { authenticate: false }
    const routeProps = t.pathOr(
      {
        home: defaultRouteProps,
        view: defaultRouteProps,
        detail: defaultRouteProps,
        more: defaultRouteProps,
      },
      ['routes'],
      props
    )
    const macroProps = t.pathOr({}, ['views'], props)
    return {
      initial: nextInitState(macroProps),
      mutations(m) {
        return [
          m(
            ['routeHome', 'routeView', 'routeViewDetail', 'routeViewMore'],
            nextRouteState(boxName, macroProps)
          ),
          m('exitRoute', nextRouteExitState(macroProps)),
          m(
            ['dataChange', 'dataLoad', 'dataLoadComplete'],
            nextViewState(boxName, macroProps)
          ),
          m(
            ['formChange', 'formTransmit', 'formTransmitComplete'],
            nextFormState(boxName, macroProps)
          ),
        ]
      },
      routes(r, actions) {
        return [
          r(actions.routeHome, path, routeProps.home || defaultRouteProps),
          r(
            actions.routeView,
            `${path}/:view`,
            routeProps.view || defaultRouteProps
          ),
          r(
            actions.routeViewDetail,
            `${path}/:view/:detail`,
            routeProps.detail || defaultRouteProps
          ),
          r(
            actions.routeViewMore,
            `${path}/:view/:detail/:more`,
            routeProps.more || defaultRouteProps
          ),
        ]
      },
      effects(fx, { mutations, actions }) {
        const matchRoutes = matchBoxRoutes(boxName)
        return [
          fx(
            [
              matchNotBoxRoutes(boxName),
              actions.routeHome,
              actions.routeView,
              actions.routeViewDetail,
              actions.routeViewMore,
            ],
            async ({ getState }, dispatch, done) => {
              const state = getState()
              const prevRoute = t.pathOr(
                null,
                ['location', 'prev', 'type'],
                state
              )
              if (matchRoutes.test(prevRoute)) {
                // const prevPath = t.pathOr(
                //   null,
                //   ['location', 'prev', 'pathname'],
                //   state
                // )
                // const currentPath = t.pathOr(
                //   null,
                //   ['location', 'pathname'],
                //   state
                // )
                // if (t.not(t.eq(prevPath, currentPath))) {
                dispatch(
                  mutations.exitRoute({
                    route: prevRoute,
                    data: t.pathOr(
                      null,
                      ['location', 'prev', 'payload'],
                      state
                    ),
                  })
                )
                // }
              }
              done()
            }
          ),
          fx(
            [matchRoutes, actions.dataLoad],
            async ({ getState, api, action, redirect }, dispatch, done) => {
              const state = t.pathOr({}, [boxName], getState())
              const loadHandle = t.pathOr(
                null,
                [state.viewKey, 'load'],
                macroProps
              )
              if (t.notType(loadHandle, 'Function')) {
                dispatch(
                  mutations.dataLoadComplete({
                    status: VIEW_STATUS.READY,
                  })
                )
                done()
              } else {
                const viewData = t.pathOr(
                  {},
                  ['views', state.viewKey, 'data'],
                  state
                )
                const formData = t.pathOr(
                  {},
                  ['views', state.viewKey, 'form', 'data'],
                  state
                )
                const detailKey = t.pathOr(
                  null,
                  ['views', state.viewKey, 'detailKey'],
                  state
                )
                const moreKey = t.pathOr(
                  null,
                  ['views', state.viewKey, 'moreKey'],
                  state
                )
                const type = t.eq(action.type, actions.dataLoad)
                  ? VIEW_LIFECYCLE.DATA_LOAD
                  : VIEW_LIFECYCLE.ROUTE_ENTER
                const [loadError, loadResult] = await a.of(
                  loadHandle({
                    type,
                    action,
                    getState,
                    dispatch,
                    redirect,
                    mutations,
                    status: VIEW_STATUS.READY,
                    api,
                    detailKey,
                    moreKey,
                    viewData,
                    formData,
                  })
                )
                if (loadError) {
                  dispatch(
                    mutations.dataLoadComplete({
                      error: loadError,
                      data: null,
                      status: VIEW_STATUS.READY,
                    })
                  )
                } else {
                  dispatch(
                    mutations.dataLoadComplete({
                      error: loadResult.error || null,
                      data: loadResult.data,
                      status: loadResult.status || VIEW_STATUS.READY,
                    })
                  )
                }
                done()
              }
            }
          ),
          fx(
            [actions.formTransmit],
            async ({ getState, action, api, redirect }, dispatch, done) => {
              const state = t.pathOr({}, [boxName], getState())
              const transmitHandle = t.pathOr(
                null,
                [state.viewKey, 'transmit'],
                macroProps
              )
              if (t.notType(transmitHandle, 'Function')) {
                dispatch(
                  mutations.formTransmitComplete({
                    status: VIEW_STATUS.READY,
                  })
                )
                done()
              } else {
                const viewData = t.pathOr(
                  {},
                  ['views', state.viewKey, 'data'],
                  state
                )
                const formData = t.pathOr(
                  {},
                  ['views', state.viewKey, 'form', 'data'],
                  state
                )
                const detailKey = t.pathOr(
                  null,
                  ['views', state.viewKey, 'detailKey'],
                  state
                )
                const moreKey = t.pathOr(
                  null,
                  ['views', state.viewKey, 'moreKey'],
                  state
                )
                const [transmitError, transmitResult] = await a.of(
                  transmitHandle({
                    type: VIEW_LIFECYCLE.FORM_TRANSMIT,
                    action,
                    getState,
                    dispatch,
                    redirect,
                    mutations,
                    status: VIEW_STATUS.READY,
                    api,
                    detailKey,
                    moreKey,
                    viewData,
                    formData,
                  })
                )
                if (transmitError) {
                  dispatch(
                    mutations.formTransmitComplete({
                      error: transmitError,
                      data: null,
                      status: VIEW_STATUS.READY,
                    })
                  )
                } else {
                  dispatch(
                    mutations.formTransmitComplete({
                      error: transmitResult.error || null,
                      data: transmitResult.data || null,
                      status: transmitResult.status || VIEW_STATUS.READY,
                    })
                  )
                }
                done()
              }
            }
          ),
        ]
      },
    }
  }
)

// useful stuff => moving to include modals
export const featureStateQuery = task(t => (name, otherKeys = []) => state => {
  const boxName = t.caseTo.camelCase(name)
  return t.merge(
    {
      brand: t.pathOr({}, ['brand'], state),
      [boxName]: t.pathOr({}, [boxName], state),
    },
    t.isZeroLen(otherKeys) ? {} : t.pick(otherKeys, state)
  )
})

export const formByKey = task(t => (key, form) => {
  return t.merge(t.pathOr({}, [key], form), {
    data: t.pathOr({}, ['data', key], form),
  })
})

export const stateToModalProps = task(t => (state, modalProps = {}) => {
  const type = t.pathOr('form', ['data', 'modal', 'type'], state)
  const mode = t.pathOr(null, ['data', 'modal', 'mode'], state)
  const modalConfirm = t.eq(mode, 'delete')
  const open = t.pathOr(false, ['data', 'modal', 'open'], state)
  const color = t.pathOr(null, ['data', 'modal', 'content', 'color'], state)
  return {
    modal: t.merge(
      {
        open,
        icon: modalConfirm
          ? null
          : t.pathOr(null, ['data', 'modal', 'icon'], state),
        color,
        title: modalConfirm
          ? null
          : t.pathOr(null, ['data', 'modal', 'content', 'title'], state),
        text: modalConfirm
          ? null
          : t.pathOr(null, ['data', 'modal', 'content', 'text'], state),
        body: modalConfirm ? { y: 'center', box: { padding: { top: 0 } } } : {},
        md: 10,
        lg: 6,
        xl: 5,
      },
      modalProps
    ),
    confirm: {
      status: state.status,
      open,
      icon: t.pathOr(null, ['data', 'modal', 'content', 'icon'], state),
      color,
      title: t.pathOr(null, ['data', 'modal', 'content', 'title'], state),
      payload: {
        data: {
          [type]: t.pathOr({}, ['data', 'modal', 'record'], state),
        },
      },
    },
    form: {
      type,
      buttonColor: color,
      error: state.error,
      status: state.status,
      form: formByKey(type, state.form),
      text: t.pathOr('Save', ['data', 'modal', 'content', 'submit'], state),
    },
  }
})
