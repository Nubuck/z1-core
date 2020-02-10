import mx from '@z1/lib-feature-macros'
const { types } = mx.view

// main
export const formx = mx.fn(t => (forms, props) => {
  const active = t.match({
    _: t.atOr('none', 'modal.active', props),
    [types.event.modalChange]: t.atOr('none', 'next.active', props),
    [types.event.formChange]: t.atOr('none', 'next.active', props),
    [types.event.formTransmit]: t.atOr(
      t.atOr('none', 'modal.active', props),
      'next.active',
      props
    ),
    [types.event.formTransmitComplete]: t.atOr(
      t.atOr('none', 'modal.active', props),
      'next.active',
      props
    ),
  })(props.event)
  const form = t.at(active, forms)
  if (t.isNil(form)) {
    return null
  }
  const activeForm = t.path(['form', active], props)
  return t.runMatch({
    _: () => null,
    [types.event.dataLoadComplete]: () => {
      return t.mapObjIndexed(
        form => ({
          entity: form.entity,
          data: {},
          ui: form.ui(props),
        }),
        forms
      )
    },
    [types.event.modalChange]: () => {
      const open = t.at('next.open', props)
      const id = t.at('next.id', props)
      const entity = t.at('entity', activeForm)
      if (t.not(open)) {
        return null
      }
      if (t.anyOf([t.isNil(id), t.isNil(entity)])) {
        return {
          [active]: t.merge(activeForm, {
            data: {},
            ui: form.ui(props),
          }),
        }
      }
      const entityList = t.split('.', entity)
      const hasNested = t.gt(t.len(entityList), 1)
      const parentPath = t.head(entityList)
      const nestedPath = hasNested ? t.tail(entityList) : []
      const preData = hasNested
        ? t.reduce(
            (collection, parent) => {
              const nested = t.pathOr(null, nestedPath, parent)
              return t.isType(nested, 'array')
                ? t.concat(collection, nested)
                : collection
            },
            [],
            t.pathOr([], ['data', parentPath], props)
          )
        : t.pathOr([], ['data', parentPath], props)
      const data = t.find(current => {
        return t.eq(current._id, id)
      }, preData)
      if (t.isNil(data)) {
        return activeForm
      }
      return {
        [active]: t.merge(activeForm, {
          data,
          ui: form.ui(props),
        }),
      }
    },
    [types.event.formTransmit]: () => {
      return {
        [active]: t.merge(activeForm, {
          data: t.atOr({}, 'next.data', props),
          ui: form.ui(props),
        }),
      }
    },
    [types.event.formTransmitComplete]: () => {
      return {
        [active]: t.merge(activeForm, {
          data: t.notNil(t.at('next.error', props))
            ? t.pathOr({}, ['form', active, 'data'], props)
            : {},
          ui: form.ui(props),
        }),
      }
    },
  })(props.event)
})
