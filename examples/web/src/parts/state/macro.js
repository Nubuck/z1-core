import mx from '@z1/lib-feature-macros'
const { types } = mx.view

// parts
const isAction = mx.fn(t => current =>
  t.allOf([t.has('type')(current), t.has('payload')(current)])
)
const subx = mx.fn((t, _, rx) => subs => {
  const next = t.reduce(
    (collection, sub) => {
      const obs = t.map(
        event => ({
          service$: rx.fromEvent(sub.service, event),
          change: 'sub',
          event,
          entity: sub.entity,
          id: t.atOr('_id', 'id', sub),
          parent: t.at('parent', sub),
          mutator: t.at('mutator', sub),
        }),
        sub.events
      )
      return t.concat(collection, obs)
    },
    [],
    subs
  )
  const entry = t.head(next)
  if (t.eq(t.len(next), 1)) {
    return entry.service$.pipe(
      rx.map(current =>
        entry.mutator({
          change: 'sub',
          id: t.atOr('_id', 'id', entry),
          parent: t.at('parent', entry),
          entity: entry.entity,
          event: entry.event,
          data: current,
        })
      )
    )
  }
  const rest$ = t.map(obs => {
    return obs.service$.pipe(
      rx.map(current => {
        if (isAction(current)) {
          return current
        }
        return obs.mutator({
          change: 'sub',
          id: t.atOr('_id', 'id', obs),
          parent: t.at('parent', obs),
          entity: obs.entity,
          event: obs.event,
          data: current,
        })
      })
    )
  }, t.tail(next))
  return entry.service$.pipe(
    rx.merge(...rest$),
    rx.map(current => {
      if (isAction(current)) {
        return current
      }
      return entry.mutator({
        change: 'sub',
        id: t.atOr('_id', 'id', entry),
        parent: t.at('parent', entry),
        entity: entry.entity,
        event: entry.event,
        data: current,
      })
    })
  )
})

const mutateEntityList = mx.fn(t => (id, event, entity, list = []) =>
  t.runMatch({
    _: () => list,
    created: () => t.append(entity, list),
    patched: () =>
      t.update(
        t.findIndex(current => t.eq(current[id], entity[id]), list),
        entity,
        list
      ),
    removed: () =>
      t.filter(current => t.not(t.eq(current[id], entity[id])), list),
  })(t.eq(event, 'updated') ? 'patched' : event)
)
const datax = mx.fn(t => props => {
  return {
    status: t.atOr(props.status, 'next.status', props),
    error: t.atOr(null, 'next.error', props),
    data: t.runMatch({
      _: () => props.data,
      [types.event.dataLoadComplete]: () => {
        const nextData = t.atOr({}, 'next.data', props)
        if (t.isEmpty(nextData)) {
          return props.data
        }
        return t.merge(props.data, nextData)
      },
      [types.event.dataChange]: () => {
        const change = t.at('next.change', props)
        if (t.isNil(change)) {
          return props.data
        }
        return t.runMatch({
          _: () => props.data,
          sub: () => {
            const id = t.atOr('_id', 'next.id', props)
            const parent = t.at('next.parent', props)
            const entity = t.at('next.entity', props)
            const event = t.at('next.event', props)
            const data = t.at('next.data', props)
            if (t.anyOf([t.isNil(entity), t.isNil(event), t.isNil(data)])) {
              return props.data
            }
            const entityList = t.split('.', entity)
            const hasNested = t.gt(t.len(entityList), 1)
            if (t.not(hasNested)) {
              return t.merge(props.data, {
                [entity]: mutateEntityList(
                  id,
                  event,
                  data,
                  t.at(entity, props.data)
                ),
              })
            }
            if (t.isNil(parent)) {
              return props.data
            }
            const parentPath = t.head(entityList)
            const nestedPath = t.tail(entityList)
            const parents = t.at(parentPath, props.data)
            return t.merge(props.data, {
              [parentPath]: t.adjust(
                t.findIndex(
                  current => t.eq(current[id], data[parent]),
                  parents
                ),
                current => {
                  return t.mergeDeepRight(
                    current,
                    t.reduce(
                      (collection, nextPath) => {
                        if (t.eq(nextPath.index, 0)) {
                          return t.merge(collection, {
                            [nextPath.key]: mutateEntityList(
                              id,
                              event,
                              data,
                              t.pathOr([], nestedPath, current)
                            ),
                          })
                        }
                        return {
                          [nextPath.key]: collection,
                        }
                      },
                      {},
                      t.mapIndexed(
                        (key, index) => ({ key, index }),
                        t.reverse(nestedPath)
                      )
                    )
                  )
                },
                parents
              ),
            })
          },
          search: () => props.data,
          sort: () => props.data,
        })(change)
      },
    })(props.event),
  }
})
const loadx = mx.fn((t, a) => async (loadList, props) => {
  const preResult = await a.map(loadList, 1, async load => {
    if (t.and(t.isNil(load.method), t.notNil(load.data))) {
      return {
        error: null,
        data: {
          [load.entity]: load.data,
        },
      }
    }
    if (t.isNil(load.method)) {
      return {
        error: loadErr,
        data: {
          [load.entity]: null,
        },
      }
    }
    const [loadErr, loadResult] = await a.of(load.method)
    if (loadErr) {
      return {
        error: loadErr,
        data: {
          [load.entity]: null,
        },
      }
    }
    return {
      error: null,
      data: {
        [load.entity]: t.isNil(load.resultAt)
          ? loadResult
          : t.atOr('data', load.resultAt, loadResult),
      },
    }
  })
  return t.merge(
    {
      status: props.status,
    },
    t.reduce(
      (collection, result) => {
        return t.merge(collection, {
          error: t.notNil(result.error) ? result.error : collection.error,
          data: t.merge(collection.data, result.data),
        })
      },
      { error: null, data: {} },
      preResult
    )
  )
})
const formx = mx.fn(t => (forms, props) => {
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
const transmitx = mx.fn((t, a) => async (transmitList, props) => {
  const active = t.atOr(
    t.atOr('none', 'modal.active', props),
    'next.active',
    props
  )
  const activeTransmit = t.find(
    transmission => t.eq(active, transmission.form),
    transmitList
  )
  if (t.isNil(activeTransmit)) {
    return null
  }
  const data = t.notNil(activeTransmit.dataAt)
    ? t.at(activeTransmit.dataAt, props)
    : t.pathOr({}, ['form', activeTransmit.form, 'data'], props)
  const method = activeTransmit.method(data)
  if (t.isNil(method)) {
    return null
  }
  const [transmitErr, transmitResult] = await a.of(method)
  if (transmitErr) {
    return {
      status: ctx.status.fail,
      error: bucketErr,
      data,
    }
  }
  return {
    status: props.status,
    error: null,
    data: t.eq(activeTransmit.result, true)
      ? t.notNil(activeTransmit.entity)
        ? { [activeTransmit.entity]: transmitResult }
        : transmitResult
      : {},
  }
})
const modalx = mx.fn(t => props => {
  return t.runMatch({
    _: () => props.modal,
    [types.event.modalChange]: () => {
      const active = t.at('next.active', props)
      return t.merge(props.modal, {
        active,
        open: t.atOr(false, 'next.open', props),
        id: t.atOr(null, 'next.id', props),
        title: t.atOr({}, 'next.title', props),
        content: t.omit(
          ['active', 'id', 'open', 'title'],
          t.atOr({}, 'next', props)
        ),
      })
    },
    [types.event.formTransmitComplete]: () => {
      if (t.not(t.at('modal.open', props))) {
        return props.modal
      }
      return t.isNil(t.at('next.error', props))
        ? t.merge(props.modal, {
            open: false,
            active: null,
            id: null,
            title: {},
            content: {},
          })
        : props.modal
    },
  })(props.event)
})

const initx = mx.fn(t => (data = {}, forms = {}, modal = {}) => ({
  data,
  form: t.mapObjIndexed(
    form => ({
      entity: form.entity,
      data: {},
      ui: form.ui({ event: types.event.init, status: types.status.init }),
    }),
    forms
  ),
  modal: t.merge(
    {
      open: false,
      active: null,
      id: null,
      title: {},
      content: {},
    },
    modal
  ),
}))

// main
export const macro = {
  initial: initx,
  subscribe: subx,
  data: datax,
  load: loadx,
  form: formx,
  transmit: transmitx,
  modal: modalx,
}
