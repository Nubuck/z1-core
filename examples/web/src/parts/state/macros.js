import mx from '@z1/lib-feature-macros'

// parts
const isSub = mx.fn(t => current =>
  t.allOf([
    t.has('change')(current),
    t.has('event')(current),
    t.has('entity')(current),
    t.has('data')(current),
  ])
)
const subscribe = mx.fn((t, _, rx) => (mutator, subs) => {
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
        mutator({
          change: 'sub',
          event: entry.event,
          entity: entry.entity,
          data: current,
          id: t.atOr('_id', 'id', entry),
          parent: t.at('parent', entry),
        })
      )
    )
  }
  const rest$ = t.map(obs => {
    return obs.service$.pipe(
      rx.map(current => {
        if (isSub(current)) {
          return current
        }
        return {
          change: 'sub',
          event: obs.event,
          entity: obs.entity,
          data: current,
          id: t.atOr('_id', 'id', obs),
          parent: t.at('parent', obs),
        }
      })
    )
  }, t.tail(next))
  return entry.service$.pipe(
    rx.merge(...rest$),
    rx.map(current => {
      if (isSub(current)) {
        return mutator(current)
      }
      return mutator({
        change: 'sub',
        event: entry.event,
        entity: entry.entity,
        data: current,
        id: t.atOr('_id', 'id', entry),
        parent: t.at('parent', entry),
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
      [ctx.event.dataLoadComplete]: () => {
        const nextData = t.atOr({}, 'next.data', props)
        if (t.isEmpty(nextData)) {
          return props.data
        }
        return t.merge(props.data, nextData)
      },
      [ctx.event.dataChange]: () => {
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
            const parentIndex = t.findIndex(
              current => t.eq(current[id], data[parent]),
              parents
            )
            const nested = t.pathOr([], nestPath, parents[parentIndex] || {})
            return t.merge(props.data, {
              [parentPath]: t.adjust(
                parentIndex,
                current => {
                  return t.merge(current, {
                    [t.head(nestedPath)]: mutateEntityList(
                      id,
                      event,
                      data,
                      nested
                    ),
                  })
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
  return {
    status: props.status,
    error: null,
    data: {},
  }
})
const formx = mx.fn(t => (forms, props) => {
  // TODO: other active sources + load event
  const active = t.eq(ctx.event.modalChange, props.event)
    ? t.atOr('none', 'next.active', props)
    : t.atOr('none', 'modal.active', props)

  const form = t.at(active, forms)
  if (t.isNil(form)) {
    return null
  }
  const activeForm = t.path(['form', active], props)
  return t.runMatch({
    _: () => null,
    [ctx.event.modalChange]: () => {
      const open = t.at('next.open', props)
      const id = t.at('next.id', props)
      const entity = t.at('entity', activeForm)
      if (t.anyOf([t.isNil(id), t.isNil(entity), t.not(open)])) {
        return {
          [active]: t.merge(activeForm, {
            data: {},
            ui: form.ui({ disabled: false }),
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
          ui: form.ui({ disabled: false }),
        }),
      }
    },
    [ctx.event.formTransmit]: () => {
      return {
        [active]: t.merge(activeForm, {
          data: t.atOr({}, 'next.data', props),
          ui: form.ui({ disabled: true }),
        }),
      }
    },
    [ctx.event.formTransmitComplete]: () => {
      return {
        [active]: t.merge(activeForm, {
          data: t.notNil(t.at('next.error', props))
            ? t.pathOr({}, ['form', active, 'data'], props)
            : {},
          ui: form.ui({ disabled: false }),
        }),
      }
    },
  })(props.event)
})
const transmitx = mx.fn((t, a) => async (opts, props) => {})
const modalx = mx.fn(t => (opts, props) => {
  // return t.runMatch({
  //   _: () => props.modal,
  //   [ctx.event.modalChange]: () => {
  //     const active = t.at('next.active', props)
  //     return t.merge(props.modal, {
  //       active,
  //       open: t.atOr(false, 'next.open', props),
  //       id: t.atOr(null, 'next.id', props),
  //       title: {},
  //       content: {},
  //     })
  //   },
  //   [ctx.event.formTransmitComplete]: () => {
  //     return t.isNil(t.at('next.error', props))
  //       ? t.merge(props.modal, {
  //           open: false,
  //           active: null,
  //           id: null,
  //           title: {},
  //           content: {},
  //         })
  //       : props.modal
  //   },
  // })(props.event)
})

// main
export const macros = {
  subscribe,
  data: datax,
}
