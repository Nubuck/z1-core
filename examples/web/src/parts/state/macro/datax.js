import mx from '@z1/lib-feature-macros'
const { types } = mx.view

//  main
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
const mutateEntityObj = mx.fn(t => (event, entity, obj = {}) =>
  t.runMatch({
    _: () => t.merge(obj, entity),
    removed: () => null,
  })(t.eq(event, 'updated') ? 'patched' : event)
)
export const mutateEntity = mx.fn(t => (id, event, entity, listOrObj) =>
  t.isType(listOrObj, 'array')
    ? mutateEntityList(id, event, entity, listOrObj)
    : mutateEntityObj(event, entity, listOrObj)
)
export const datax = mx.fn(t => props => {
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
                [entity]: mutateEntity(
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
            const nestedIndexed = t.mapIndexed(
              (key, index) => ({ key, index }),
              t.reverse(nestedPath)
            )
            const reduceNested = current =>
              t.reduce(
                (collection, nextPath) => {
                  if (t.eq(nextPath.index, 0)) {
                    return t.merge(collection, {
                      [nextPath.key]: mutateEntity(
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
                nestedIndexed
              )
            if (t.isType(parents, 'object')) {
              return t.merge(props.data, {
                [parentPath]: t.mergeDeepRight(parents, reduceNested(parents)),
              })
            }
            return t.merge(props.data, {
              [parentPath]: t.adjust(
                t.findIndex(
                  current => t.eq(current[id], data[parent]),
                  parents
                ),
                current => {
                  return t.mergeDeepRight(current, reduceNested(current))
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
