import { task, VIEW_STATUS } from '@z1/lib-feature-box'

// ctx
export const VIEW_LIFECYCLE = {
  INIT: 'init',
  ROUTE_ENTER: 'route-enter',
  ROUTE_EXIT: 'route-exit',
  DATA_CHANGE: 'data-change',
  DATA_LOAD: 'data-load',
  DATA_LOAD_COMPLETE: 'data-load-complete',
  FORM_CHANGE: 'form-change',
  FORM_TRANSMIT: 'form-transmit',
  FORM_TRANSMIT_COMPLETE: 'form-transmit-complete',
}

// state
const isHandleInvalid = task(t => handle =>
  t.or(t.isNil(handle), t.notType(handle, 'Function'))
)

export const nextInitState = task(t => (views = {}) => {
  return {
    viewKey: null,
    route: null,
    views: t.mergeAll(
      t.map(([key, val]) => {
        const dataHandle = t.pathOr(null, ['data'], val)
        const formHandle = t.pathOr(null, ['form'], val)
        const nextViewData = isHandleInvalid(dataHandle)
          ? {}
          : dataHandle({
              type: VIEW_LIFECYCLE.INIT,
              status: VIEW_STATUS.INIT,
              viewData: null,
              formData: null,
              nextData: null,
              error: null,
              state: {},
            })
        return {
          [t.caseTo.constantCase(key)]: {
            status: t.pathOr(VIEW_STATUS.INIT, ['status'], nextViewData || {}),
            error: t.pathOr(null, ['error'], nextViewData || {}),
            detailKey: null,
            moreKey: null,
            data: t.pathOr({}, ['data'], nextViewData || {}),
            form: isHandleInvalid(formHandle)
              ? {}
              : formHandle({
                  type: VIEW_LIFECYCLE.INIT,
                  status: t.pathOr(VIEW_STATUS.INIT, ['status'], nextViewData || {}),
                  formData: {},
                  nextData: null,
                  viewData: t.pathOr({}, ['data'], nextViewData || {}),
                }),
          },
        }
      }, t.toPairs(views))
    ),
  }
})

export const nextRouteState = task(
  t => (boxName = 'box', macroProps = {}) => (state, action) => {
    const viewKey = t.caseTo.constantCase(
      t.pathOr('home', ['payload', 'view'], action) || 'home'
    )
    // handles
    const dataHandle = t.pathOr(null, [viewKey, 'data'], macroProps)
    const formHandle = t.pathOr(null, [viewKey, 'form'], macroProps)
    // state
    const detailKey = t.pathOr(null, ['payload', 'detail'], action)
    const moreKey = t.pathOr(null, ['payload', 'more'], action)
    const viewState = t.pathOr({}, ['views', viewKey], state)
    const nextViewData = isHandleInvalid(dataHandle)
      ? t.pathOr({}, ['data'], viewState)
      : dataHandle({
          type: VIEW_LIFECYCLE.ROUTE_ENTER,
          status: VIEW_STATUS.WAITING,
          viewData: t.pathOr({}, ['data'], viewState),
          formData: t.pathOr({}, ['formData'], viewState),
          nextData: action.payload.data || null,
          error: null,
          state: t.omit(['views', 'route', 'viewKey'], state),
        })
    return t.merge(state, {
      viewKey,
      route: action.type.replace(`${boxName}/`, ''),
      views: t.merge(state.views, {
        [viewKey]: t.mergeAll([
          viewState,
          {
            detailKey,
            moreKey,
            status: t.pathOr(VIEW_STATUS.WAITING, ['status'], nextViewData  || {}),
            error: null,
            data: t.pathOr(viewState.data, ['data'], nextViewData || {}),
          },
          {
            form: isHandleInvalid(formHandle)
              ? viewState.form
              : formHandle({
                  type: VIEW_LIFECYCLE.ROUTE_ENTER,
                  status: t.pathOr(
                    VIEW_STATUS.WAITING,
                    ['status'],
                    nextViewData
                  ),
                  formData: viewState.formData,
                  nextData: null,
                  viewData: nextViewData.data || viewState.data,
                }),
          },
        ]),
      }),
    })
  }
)

export const nextRouteExitState = task(
  t => (macroProps = {}) => (state, action) => {
    const viewKey = t.caseTo.constantCase(
      t.pathOr('home', ['payload', 'data', 'view'], action) || 'home'
    )
    // handles
    const dataHandle = t.pathOr(null, [viewKey, 'data'], macroProps)
    const formHandle = t.pathOr(null, [viewKey, 'form'], macroProps)
    // state
    const viewState = t.pathOr({}, ['views', viewKey], state)
    const detailKey = t.pathOr(
      viewState.detailKey,
      ['payload', 'data', 'detail'],
      action
    )
    const moreKey = t.pathOr(
      viewState.moreKey,
      ['payload', 'data', 'more'],
      action
    )
    const nextViewData = isHandleInvalid(dataHandle)
      ? viewState.data
      : dataHandle({
          type: VIEW_LIFECYCLE.ROUTE_EXIT,
          status: viewState.status,
          viewData: viewState.data,
          formData: viewState.formData,
          nextData: action.payload.data || null,
          error: null,
          state: t.omit(['views', 'route', 'viewKey'], state),
        })
    return t.merge(state, {
      views: t.merge(state.views, {
        [viewKey]: t.mergeAll([
          viewState,
          {
            detailKey,
            moreKey,
            status: nextViewData.status || viewState.status,
            error: null,
            data: nextViewData.data || viewState.data,
          },
          {
            form: isHandleInvalid(formHandle)
              ? viewState.form
              : formHandle({
                  type: VIEW_LIFECYCLE.ROUTE_EXIT,
                  status: nextViewData.status || viewState.status,
                  formData: viewState.formData,
                  nextData: null,
                  viewData: nextViewData.data || viewState.data,
                }),
          },
        ]),
      }),
    })
  }
)

export const nextViewState = task(
  t => (boxName = 'box', macroProps = {}) => (state, action) => {
    // handles
    const dataHandle = t.pathOr(null, [state.viewKey, 'data'], macroProps)
    const formHandle = t.pathOr(null, [state.viewKey, 'form'], macroProps)
    // state
    const viewState = t.pathOr({}, ['views', state.viewKey], state)
    const formData = t.pathOr({}, ['form', 'data'], viewState)
    const type = t.caseTo.paramCase(action.type.replace(`${boxName}/`, ''))
    const nextViewState = t.isType(dataHandle, 'Function')
      ? t.merge(
          t.path(['views', state.viewKey], state),
          dataHandle({
            type,
            status: action.payload.status || viewState.status,
            viewData: viewState.data,
            formData,
            nextData: action.payload.data || null,
            error: action.payload.error || viewState.error,
            state: t.omit(['views', 'route', 'viewKey'], state),
          })
        )
      : t.merge(t.path(['views', state.viewKey], state), {
          status: action.payload.status || VIEW_STATUS.READY,
          data: action.payload.data || viewState.data,
          error: action.payload.error || viewState.error,
        })
    const nextForm = t.isType(formHandle, 'Function')
      ? formHandle({
          type,
          status: nextViewState.status,
          formData,
          nextData: null,
          viewData: nextViewState.data,
        })
      : t.path(['views', state.viewKey, 'form'], state)
    return t.merge(state, {
      views: t.merge(state.views, {
        [state.viewKey]: t.merge(nextViewState, { form: nextForm }),
      }),
    })
  }
)

export const nextFormState = task(
  t => (boxName = 'box', macroProps = {}) => (state, action) => {
    // handles
    const formHandle = t.pathOr(null, [state.viewKey, 'form'], macroProps)
    const dataHandle = t.pathOr(null, [state.viewKey, 'data'], macroProps)
    // state
    if (t.isNil(formHandle)) {
      return state
    }
    const currentView = t.pathOr({}, ['views', state.viewKey], state)
    const type = t.caseTo.paramCase(action.type.replace(`${boxName}/`, ''))
    const matchType = t.getMatch(type)
    const nextStatus = matchType({
      [VIEW_LIFECYCLE.FORM_CHANGE]: currentView.status,
      [VIEW_LIFECYCLE.FORM_TRANSMIT]: VIEW_STATUS.LOADING,
      [VIEW_LIFECYCLE.FORM_TRANSMIT_COMPLETE]:
        action.payload.status || currentView.status,
    })
    const viewState = t.merge(currentView, { status: nextStatus })
    const formState = t.pathOr({}, ['form'], viewState)
    const nextViewState = matchType({
      [VIEW_LIFECYCLE.FORM_CHANGE]: viewState,
      [VIEW_LIFECYCLE.FORM_TRANSMIT]: viewState,
      [VIEW_LIFECYCLE.FORM_TRANSMIT_COMPLETE]: t.isType(dataHandle, 'Function')
        ? dataHandle({
            type,
            status: viewState.status,
            viewData: viewState.data,
            nextData: null,
            formData: action.payload.data || formState.data,
            error: action.payload.error || viewState.error,
            state: t.omit(['views', 'route', 'viewKey'], state),
          })
        : viewState,
    })
    const nextFormState = formHandle({
      type,
      status: nextViewState.status,
      viewData: nextViewState.data,
      formData: formState.data,
      nextData: action.payload.data,
    })
    return t.merge(state, {
      views: t.merge(state.views, {
        [state.viewKey]: t.mergeAll([
          viewState,
          nextViewState,
          {
            form: t.merge(formState, nextFormState),
          },
        ]),
      }),
    })
  }
)

// fx
export const matchBoxRoutes = task(t => boxName =>
  t.globrex(`${boxName}/ROUTE_*`).regex
)
export const matchNotBoxRoutes = task(t => boxName =>
  t.globrex(`!(${boxName})*/ROUTE_*`, { extended: true }).regex
)
