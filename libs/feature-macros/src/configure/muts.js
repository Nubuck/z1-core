import { fn } from '@z1/lib-feature-box'

// ctx
import { types } from '../types'

// main
const init = fn(t => (views = {}) => {
  return {
    route: {
      action: null,
      key: null,
      view: null,
      detail: null,
      more: null,
    },
    active: {
      param: null,
      view: null,
    },
    views: t.fromPairs(([key, props]) => {
      return [
        key,
        {
          status: types.status.init,
          subbed: false,
          error: null,
          data: t.pathOr({}, ['initial', 'data'], props),
          form: t.pathOr({}, ['initial', 'form'], props),
          modal: t.pathOr({}, ['initial', 'modal'], props),
        },
      ]
    }, t.to.pairs(views)),
  }
})

const routeFromAction = fn(t => (boxName, action) => {
  const params = {
    view: t.pathOr('home', ['payload', 'view'], action),
    detail: t.pathOr(null, ['payload', 'detail'], action),
    more: t.pathOr(null, ['payload', 'more'], action),
  }
  return t.merge(
    {
      action: action.type.replace(`${boxName}/`, ''),
      key: t.tags.oneLineTrim`
      ${t.mapIndexed(
        ([_, value], index) =>
          `${t.isNil(value) ? '' : t.to.camelCase(key)}${
            t.or(t.isNil(value), t.eq(2, index)) ? '' : '_'
          }`,
        t.to.pairs(params)
      )}
      `,
    },
    params
  )
})

const routeEnter = fn(t => (boxName, props) => (state, action) => {
  const route = routeFromAction(boxName, action)
  // const viewState = t.merge(t.pathOr({}, ['state'], props), { _: null })

  // const view = t.pathOr(null, ['payload', 'view'], action)
  // const matchedViewState = t.match(viewState)(t.to.camelCase(view))
  // if (t.isNil(matchedViewState)) {
  //   return state
  // }
  // const nextViewState = matchedViewState.data({
  //   event: types.event.routeEnter,
  //   status: null,
  //   error: null,
  //   viewData: {},
  //   nextData: {},
  // })
  // return t.isNil(nextState)
  //   ? state
  //   : t.merge(state, {
  //       views: t.merge(state.views, {
  //         [view]: { data: nextViewState },
  //       }),
  //     })
})

const routeExist = fn(t => (boxName, views) => (state, action) => {
  const route = routeFromAction(boxName, action)
})

const viewData = fn(t => (boxName, views) => (state, action) => {})

const formData = fn(t => (boxName, views) => (state, action) => {})

const modalData = fn(t => (boxName, views) => (state, action) => {})
