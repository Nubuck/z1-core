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
        // handles
        const dataHandle = t.pathOr(null, ['data'], val)
        const formHandle = t.pathOr(null, ['form'], val)
        // next state
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
              detailKey: null,
              moreKey: null,
            })
        // current state
        const currentData = t.pathOr({}, ['data'], nextViewData || {})
        const currentStatus = t.pathOr(
          VIEW_STATUS.INIT,
          ['status'],
          nextViewData || {}
        )
        return {
          [t.caseTo.constantCase(key)]: {
            status: currentStatus,
            error: t.pathOr(null, ['error'], nextViewData || {}),
            detailKey: null,
            moreKey: null,
            data: currentData,
            form: isHandleInvalid(formHandle)
              ? {}
              : formHandle({
                  type: VIEW_LIFECYCLE.INIT,
                  status: currentStatus,
                  formData: {},
                  nextData: null,
                  viewData: currentData,
                  detailKey: null,
                  moreKey: null,
                }),
          },
        }
      }, t.toPairs(views))
    ),
  }
})

const nextViewKey = task(t => (action, withoutData = true) =>
  withoutData
    ? t.caseTo.constantCase(
        t.pathOr('home', ['payload', 'view'], action) || 'home'
      )
    : t.caseTo.constantCase(
        t.pathOr('home', ['payload', 'data', 'view'], action) || 'home'
      )
)

const nextDetailKey = task(t => (action, viewState = null) =>
  t.isNil(viewState)
    ? t.pathOr(null, ['payload', 'detail'], action)
    : t.pathOr(viewState.detailKey, ['payload', 'data', 'detail'], action)
)

const nextMoreKey = task(t => (action, viewState = null) =>
  t.isNil(viewState)
    ? t.pathOr(null, ['payload', 'more'], action)
    : t.pathOr(viewState.moreKey, ['payload', 'data', 'more'], action)
)

export const nextRouteState = task(
  t => (boxName = 'box', macroProps = {}) => (state, action) => {
    const viewKey = nextViewKey(action)
    const detailKey = nextDetailKey(action)
    const moreKey = nextMoreKey(action)
    // handles
    const dataHandle = t.pathOr(null, [viewKey, 'data'], macroProps)
    const formHandle = t.pathOr(null, [viewKey, 'form'], macroProps)
    // previous state
    const viewState = t.pathOr({}, ['views', viewKey], state)
    const viewStateData = t.pathOr({}, ['data'], viewState)
    const viewStateForm = t.pathOr({}, ['form'], viewState)
    const viewStateFormData = t.pathOr({}, ['data'], viewStateForm)
    // next state
    const nextViewData = isHandleInvalid(dataHandle)
      ? viewStateData
      : dataHandle({
          type: VIEW_LIFECYCLE.ROUTE_ENTER,
          status: VIEW_STATUS.WAITING,
          viewData: viewStateData,
          formData: viewStateFormData,
          nextData: action.payload.data || null,
          error: null,
          state: t.omit(['views', 'route', 'viewKey'], state),
          detailKey,
          moreKey,
        })
    // current state
    const currentData = t.pathOr(viewStateData, ['data'], nextViewData || {})
    const currentStatus = t.pathOr(
      VIEW_STATUS.WAITING,
      ['status'],
      nextViewData || {}
    )
    return t.merge(state, {
      viewKey,
      route: action.type.replace(`${boxName}/`, ''),
      views: t.merge(state.views, {
        [viewKey]: t.mergeAll([
          viewState,
          {
            detailKey,
            moreKey,
            status: currentStatus,
            error: null,
            data: currentData,
          },
          {
            form: isHandleInvalid(formHandle)
              ? viewStateForm
              : formHandle({
                  type: VIEW_LIFECYCLE.ROUTE_ENTER,
                  status: currentStatus,
                  formData: viewStateFormData,
                  nextData: null,
                  viewData: currentData,
                  detailKey,
                  moreKey,
                }),
          },
        ]),
      }),
    })
  }
)

export const nextRouteExitState = task(
  t => (macroProps = {}) => (state, action) => {
    const viewKey = nextViewKey(action, false)
    // handles
    const dataHandle = t.pathOr(null, [viewKey, 'data'], macroProps)
    const formHandle = t.pathOr(null, [viewKey, 'form'], macroProps)
    // previous state
    const viewState = t.pathOr({}, ['views', viewKey], state)
    const detailKey = nextDetailKey(action, viewState)
    const moreKey = nextMoreKey(action, viewState)
    const viewStateData = t.pathOr({}, ['data'], viewState)
    const viewStateStatus = t.pathOr(VIEW_STATUS.READY, ['status'], viewState)
    const viewStateForm = t.pathOr({}, ['form'], viewState)
    const viewStateFormData = t.pathOr({}, ['data'], viewStateForm)
    // next state
    const nextViewData = isHandleInvalid(dataHandle)
      ? viewStateData
      : dataHandle({
          type: VIEW_LIFECYCLE.ROUTE_EXIT,
          status: viewStateStatus,
          viewData: viewStateData,
          formData: viewStateFormData,
          nextData: action.payload.data || null,
          error: null,
          state: t.omit(['views', 'route', 'viewKey'], state),
          detailKey,
          moreKey,
        })
    // current state
    const currentData = t.pathOr(viewStateData, ['data'], nextViewData || {})
    const currentStatus = t.pathOr(
      viewStateStatus,
      ['status'],
      nextViewData || {}
    )
    return t.merge(state, {
      views: t.merge(state.views, {
        [viewKey]: t.mergeAll([
          viewState,
          {
            detailKey,
            moreKey,
            status: currentStatus,
            error: null,
            data: currentData,
          },
          {
            form: isHandleInvalid(formHandle)
              ? viewStateForm
              : formHandle({
                  type: VIEW_LIFECYCLE.ROUTE_EXIT,
                  status: currentStatus,
                  formData: viewStateFormData,
                  nextData: null,
                  viewData: currentData,
                  detailKey,
                  moreKey,
                }),
          },
        ]),
      }),
    })
  }
)

export const nextViewState = task(
  t => (boxName = 'box', macroProps = {}) => (state, action) => {
    const viewKey = state.viewKey || 'home'
    const type = t.caseTo.paramCase(action.type.replace(`${boxName}/`, ''))
    // handles
    const dataHandle = t.pathOr(null, [viewKey, 'data'], macroProps)
    const formHandle = t.pathOr(null, [viewKey, 'form'], macroProps)
    // previous state
    const viewState = t.pathOr({}, ['views', viewKey], state)
    const detailKey = nextDetailKey(action, viewState)
    const moreKey = nextMoreKey(action, viewState)
    const viewStateData = t.pathOr({}, ['data'], viewState)
    const viewStateStatus = t.pathOr(
      action.payload.status,
      ['status'],
      viewState
    )
    const viewStateForm = t.pathOr({}, ['form'], viewState)
    const viewStateFormData = t.pathOr({}, ['data'], viewStateForm)
    // next state
    const nextViewState = isHandleInvalid(dataHandle)
      ? t.merge(t.path(['views', viewKey], state), {
          status: action.payload.status || VIEW_STATUS.READY,
          data: action.payload.data || viewStateData,
          error: action.payload.error || viewState.error,
        })
      : t.merge(
          t.path(['views', viewKey], state),
          dataHandle({
            type,
            status: action.payload.status || viewStateStatus,
            viewData: viewStateData,
            formData: viewStateFormData,
            nextData: action.payload.data || null,
            error: action.payload.error || viewState.error,
            state: t.omit(['views', 'route', 'viewKey'], state),
            detailKey,
            moreKey,
          })
        )
    // current state
    const currentData = t.pathOr(viewStateData, ['data'], nextViewState || {})
    const currentStatus = t.pathOr(
      viewStateStatus,
      ['status'],
      nextViewState || {}
    )
    const nextForm = isHandleInvalid(formHandle)
      ? viewStateForm
      : formHandle({
          type,
          status: currentStatus,
          formData: viewStateFormData,
          nextData: null,
          viewData: currentData,
          detailKey,
          moreKey,
        })
    return t.merge(state, {
      views: t.merge(state.views, {
        [viewKey]: t.merge(nextViewState, { form: nextForm }),
      }),
    })
  }
)

export const nextFormState = task(
  t => (boxName = 'box', macroProps = {}) => (state, action) => {
    const viewKey = state.viewKey || 'home'
    // handles
    const formHandle = t.pathOr(null, [viewKey, 'form'], macroProps)
    if (isHandleInvalid(formHandle)) {
      return state
    }
    const type = t.caseTo.paramCase(action.type.replace(`${boxName}/`, ''))
    const dataHandle = t.pathOr(null, [viewKey, 'data'], macroProps)
    // partial state
    const partialViewState = t.pathOr({}, ['views', viewKey], state)
    const partialViewStateStatus = t.pathOr(
      VIEW_STATUS.READY,
      ['status'],
      partialViewState
    )
    const matchType = t.getMatch(type)
    const nextStatus = matchType({
      [VIEW_LIFECYCLE.FORM_CHANGE]: partialViewStateStatus,
      [VIEW_LIFECYCLE.FORM_TRANSMIT]: VIEW_STATUS.LOADING,
      [VIEW_LIFECYCLE.FORM_TRANSMIT_COMPLETE]:
        action.payload.status || partialViewStateStatus,
    })
    // previous state
    const viewState = t.merge(partialViewState, { status: nextStatus })
    const detailKey = nextDetailKey(action, viewState)
    const moreKey = nextMoreKey(action, viewState)
    const viewStateData = t.pathOr({}, ['data'], viewState)
    const viewStateForm = t.pathOr({}, ['form'], viewState)
    const viewStateFormData = t.pathOr({}, ['data'], viewStateForm)
    // next state
    const nextViewState = matchType({
      [VIEW_LIFECYCLE.FORM_CHANGE]: viewState,
      [VIEW_LIFECYCLE.FORM_TRANSMIT]: viewState,
      [VIEW_LIFECYCLE.FORM_TRANSMIT_COMPLETE]: isHandleInvalid(dataHandle)
        ? viewState
        : dataHandle({
            type,
            status: viewState.status,
            viewData: viewStateData,
            nextData: null,
            formData: action.payload.data || viewStateFormData,
            error: action.payload.error || viewState.error,
            state: t.omit(['views', 'route', 'viewKey'], state),
            detailKey,
            moreKey,
          }),
    })
    // current state
    const currentViewState = nextViewState || {}
    const currentData = t.pathOr(viewStateData, ['data'], currentViewState)
    const currentStatus = t.pathOr(
      viewState.status,
      ['status'],
      currentViewState
    )
    const nextFormState = formHandle({
      type,
      status: currentStatus,
      viewData: currentData,
      formData: viewStateFormData,
      nextData: action.payload.data,
    })
    return t.merge(state, {
      views: t.merge(state.views, {
        [viewKey]: t.mergeAll([
          viewState,
          currentViewState,
          {
            form: t.merge(viewStateFormData, nextFormState),
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
