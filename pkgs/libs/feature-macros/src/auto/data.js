import z from '@z1/lib-feature-box'
import { types } from '../types'

//  main
const mutateEntityList = z.fn(
  (t) => (id, event, entity, list = [], prepend = false) =>
    t.runMatch({
      _: () => list,
      created: () =>
        t.eq(true, prepend) ? t.prepend(entity, list) : t.append(entity, list),
      patched: () =>
        t.update(
          t.findIndex((current) => t.eq(current[id], entity[id]), list),
          entity,
          list
        ),
      removed: () =>
        t.filter((current) => t.not(t.eq(current[id], entity[id])), list),
    })(t.or(t.eq(event, 'updated'), t.eq(event, 'state')) ? 'patched' : event)
)
const mutateEntityObj = z.fn((t) => (event, entity, obj = {}) =>
  t.runMatch({
    _: () => t.mergeDeepRight(obj, entity),
    removed: () => null,
  })(t.or(t.eq(event, 'updated'), t.eq(event, 'state')) ? 'patched' : event)
)
export const mutateEntity = z.fn(
  (t) => (id, event, entity, listOrObj, prepend) =>
    t.isType(listOrObj, 'array')
      ? mutateEntityList(id, event, entity, listOrObj, prepend)
      : mutateEntityObj(event, entity, listOrObj)
)
export const datax = z.fn((t) => (props) => {
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
          _: () => {
            // NOTE: more complete data transforms needed
            const data = t.at('next.data', props)
            const entity = t.at('next.entity', props)
            const entityList = t.split('.', entity)
            const hasNested = t.gt(t.len(entityList), 1)
            if (hasNested) {
              const parentPath = t.head(entityList)
              const current = t.at(parentPath, props.data)
              const target = t.last(entityList)
              const result = t.merge(props.data, {
                [parentPath]: t.merge(current, {
                  [target]: data,
                }),
              })
              return result
            }
            if (t.eq(t.at(entity, props.data), data)) {
              return props.data
            }
            return t.and(t.notNil(data), t.notNil(entity))
              ? t.merge(props.data, {
                  [entity]: data,
                })
              : props.data
          },
          sub: () => {
            const id = t.atOr('_id', 'next.id', props)
            const parent = t.at('next.parent', props)
            const entity = t.at('next.entity', props)
            const event = t.at('next.event', props)
            const data = t.at('next.data', props)
            const prepend = t.atOr(false, 'next.prepend', props)
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
                  t.at(entity, props.data),
                  prepend
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
            const reduceNested = (current) =>
              t.reduce(
                (collection, nextPath) => {
                  if (t.eq(nextPath.index, 0)) {
                    return t.merge(collection, {
                      [nextPath.key]: mutateEntity(
                        id,
                        event,
                        data,
                        t.pathOr([], nestedPath, current),
                        prepend
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
                  (current) => t.eq(current[id], data[parent]),
                  parents
                ),
                (current) => {
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
      [types.event.formTransmitComplete]: () => {
        const nextData = t.atOr({}, 'next.data', props)
        if (t.isEmpty(nextData)) {
          return props.data
        }
        return t.merge(props.data, nextData)
      },
    })(props.event),
  }
})
export default datax
