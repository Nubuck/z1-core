import { fn } from '@z1/lib-feature-box'

// main
export const create = fn(t => (name, { state, ui, render }) => {
  const param = t.isType(name, 'string')
    ? 'view'
    : t.eq(t.len(name), 1)
    ? 'viewList'
    : t.eq(t.len(name), 2)
    ? 'detail'
    : t.eq(t.len(name), 3)
    ? 'more'
    : 'extra'
  return {
    key: t.match(param)({
      view: `${t.to.camelCase(name)}`,
      viewList: `${t.to.camelCase(t.head(name))}`,
      _: t.tags.oneLineTrim`
      ${t.mapIndexed(
        (key, index) =>
          `${t.to.camelCase(key)}${t.eq(t.len(name) - 1, index) ? '' : '_'}`,
        name
      )}
      `,
    }),
    // param: t.eq(param, 'viewList') ? 'view' : param,
    state(ctx) {
      const nextState = t.isType(state, 'function') ? state(ctx) : state
      return {
        initial: t.pathOr({}, ['initial'], nextState),
        data(props) {
          const dataHandle = t.pathOr(() => null, ['data'], nextState)
          return dataHandle(props)
        },
        form(props) {
          const formHandle = t.pathOr(() => null, ['form'], nextState)
          return formHandle(props)
        },
        modal(props) {
          const modalHandle = t.pathOr(() => null, ['modal'], nextState)
          return modalHandle(props)
        },
        subscribe(props) {
          const subscribeHandle = t.pathOr(() => null, ['subscribe'], nextState)
          return subscribeHandle(props)
        },
        async load(props) {
          const loadHandle = t.pathOr(null, ['load'], nextState)
          if (t.isNil(loadHandle)) {
            return null
          }
          return await loadHandle(props)
        },
        async transmit(props) {
          const transmitHandle = t.pathOr(null, ['transmit'], nextState)
          if (t.isNil(transmitHandle)) {
            return null
          }
          return await transmitHandle(props)
        },
      }
    },
    ui(ctx) {
      if (t.and(t.isNil(ui), t.isNil(render))) {
        return null
      }
      if (t.isType(ui, 'function')) {
        return ui(ctx)
      }
      return render
    },
  }
})
