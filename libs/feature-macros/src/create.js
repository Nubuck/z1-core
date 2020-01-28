import { fn } from '@z1/lib-feature-box'

// main
export const create = fn(t => (name, { state, ui, render }) => {
  const param = t.isType(name, 'string')
    ? 'view'
    : t.eq(t.len(name), 1)
    ? 'viewList'
    : t.eq(t.len(name), 2)
    ? 'detail'
    : 'more'
  const nextName = t.includes(param, ['viewList', 'detail', 'more'])
    ? t.last(name)
    : name
  return {
    name: nextName,
    key: t.or(t.eq(param, 'detail'), t.eq(param, 'more'))
      ? t.replace(
          /\s/g,
          '',
          t.tags.oneLineInlineLists`
          ${t.mapIndexed(
            (key, index) =>
              `${t.to.camelCase(key)}${
                t.eq(t.len(name) - 1, index) ? '' : '_'
              }`,
            name
          )}`
        )
      : t.to.camelCase(nextName),
    param: t.eq(param, 'viewList') ? 'view' : param,
    state(ctx) {
      const nextState = t.isType(state, 'function') ? state(ctx) : state
      return {
        _shouldSub: t.has('subscribe')(nextState),
        initial: t.merge(
          { subbed: false },
          t.atOr({ data: {}, form: {}, modal: {} }, 'initial', nextState)
        ),
        data(props) {
          const dataHandle = t.atOr(() => null, 'data', nextState)
          return dataHandle(props)
        },
        form(props) {
          const formHandle = t.atOr(() => null, 'form', nextState)
          return formHandle(props)
        },
        modal(props) {
          const modalHandle = t.atOr(() => null, 'modal', nextState)
          return modalHandle(props)
        },
        subscribe(context, box) {
          const subscribeHandle = t.atOr(() => null, 'subscribe', nextState)
          return subscribeHandle(context, box)
        },
        async load(props) {
          const loadHandle = t.atOr(null, 'load', nextState)
          if (t.isNil(loadHandle)) {
            return null
          }
          return await loadHandle(props)
        },
        async transmit(props) {
          const transmitHandle = t.atOr(null, 'transmit', nextState)
          if (t.isNil(transmitHandle)) {
            return null
          }
          return await transmitHandle(props)
        },
        async exit(props) {
          const exitHandle = t.atOr(null, 'exit', nextState)
          if (t.isNil(exitHandle)) {
            return null
          }
          return await exitHandle(props)
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
