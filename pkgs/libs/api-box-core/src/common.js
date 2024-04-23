import { task } from '@z1/preset-task'
import {
  FeathersAuth,
  FeathersAuthLocal,
  FeathersCommonHooks,
  FeathersAuthHooks,
} from '@z1/preset-feathers-server-core'
import { uuidv4, validate } from 'uuid'

// main
export const common = task((t) => {
  const safeParse = (val) => {
    if (t.isNil(val)) {
      return null
    }
    if (t.or(t.ofType('object', val), t.ofType('array', val))) {
      return val
    }
    if (t.isZeroLen(val)) {
      return []
    }
    try {
      return JSON.parse(val.replace(/\n/g, '\\n'))
    } catch (e) {
      return val
    }
  }
  const safeStringify = (val) => {
    if (t.or(t.ofType('object', val), t.ofType('array', val))) {
      return JSON.stringify(val)
    }
    return t.ofType('string', val) ? val : '{}'
  }
  const idOrUuid = (idKey, data) => {
    const idVal = data[idKey]
    if (t.notNil(idVal) && idVal !== '' && validate(idVal || '______')) {
      return idVal
    }
    return uuidv4()
  }

  return {
    hookSignature(def) {
      return t.anyOf([
        t.has('before')(def),
        t.has('after')(def),
        t.has('error')(def),
      ])
    },
    hookAndEventSignature(def) {
      return t.anyOf([t.has('hooks')(def), t.has('events')(def)])
    },
    safeServiceName(path) {
      return t.and(t.startsWith('/', path), t.endsWith('/', path))
        ? t.valPipe(path)(t.tail, t.dropLast(1))
        : t.startsWith('/', path)
        ? t.tail(path)
        : t.endsWith('/', path)
        ? t.dropLast(1, path)
        : path
    },
    commonHooks: {
      auth: t.mergeAll([
        FeathersAuth.hooks,
        FeathersAuthLocal.hooks,
        FeathersAuthHooks,
      ]),
      common: FeathersCommonHooks,
      data: {
        withIdUUIDV4(hook) {
          if (t.and(t.eq(hook.type, 'before'), t.eq(hook.method, 'create'))) {
            if (t.ofType('array', hook.data)) {
              hook.data = t.map((rec) => {
                rec[hook.service.id] = idOrUuid(hook.service.id, rec)
                return rec
              })(hook.data)
            } else {
              hook.data[hook.service.id] = idOrUuid(hook.service.id, hook.data)
            }
          }
          return hook
        },
        withUUIDV4: (field) => (hook) => {
          if (t.and(t.eq(hook.type, 'before'), t.eq(hook.method, 'create'))) {
            if (t.ofType('array', hook.data)) {
              hook.data = t.map((rec) => {
                rec[field] = uuidv4()
                return rec
              })(hook.data)
            } else {
              hook.data[field] = uuidv4()
            }
          }
          return hook
        },
        withSafeParse:
          (keys = []) =>
          (ctx) => {
            if (t.eq(ctx.method, 'find')) {
              ctx.result.data = t.map(
                (item) =>
                  t.merge(
                    item,
                    t.mergeAll(
                      t.map((key) => {
                        return {
                          [key]: safeParse(item[key]),
                        }
                      }, keys)
                    )
                  ),
                ctx.result.data || []
              )
            } else if (t.notNil(t.at('result._id', ctx))) {
              ctx.result = t.merge(
                ctx.result,
                t.mergeAll(
                  t.map((key) => {
                    return {
                      [key]: safeParse(ctx.result[key]),
                    }
                  }, keys)
                )
              )
            } else if (t.ofType('array', ctx.result)) {
              ctx.result = t.map(
                (item) =>
                  t.merge(
                    item,
                    t.mergeAll(
                      t.map((key) => {
                        return {
                          [key]: safeParse(item[key]),
                        }
                      }, keys)
                    )
                  ),
                ctx.result
              )
            }

            return ctx
          },
        withSafeStringify:
          (keys = []) =>
          (ctx) => {
            if (
              t.anyOf([
                t.eq(ctx.method, 'create'),
                t.eq(ctx.method, 'patch'),
                t.eq(ctx.method, 'update'),
              ])
            ) {
              ctx.data = t.ofType('array', ctx.data)
                ? t.map((item) => {
                    return t.merge(
                      item,
                      t.mergeAll(
                        t.map((key) => {
                          if (t.isNil(item[key])) {
                            return {}
                          }
                          return {
                            [key]: safeStringify(item[key]),
                          }
                        }, keys)
                      )
                    )
                  }, ctx.data)
                : t.merge(
                    ctx.data,
                    t.mergeAll(
                      t.map((key) => {
                        if (t.isNil(ctx.data[key])) {
                          return {}
                        }
                        return {
                          [key]: safeStringify(ctx.data[key]),
                        }
                      }, keys)
                    )
                  )
            }
            return ctx
          },
        // LEGACY
        safeFindMSSQL(hook) {
          // const db = hook.app.get('db') || {}
          // if (t.eq('find', hook.method)) {
          //   if (t.eq('mssql', db.dialect)) {
          //     if (t.not(t.at('params.query.$sort', hook))) {
          //       if (t.not(t.has('params')(hook))) {
          //         hook.params = {
          //           query: {
          //             $sort: { id: 1 },
          //           },
          //         }
          //       } else if (t.not(t.has('query')(hook.params))) {
          //         hook.params.query = {
          //           $sort: { id: 1 },
          //         }
          //       } else {
          //         hook.params.query.$sort = { id: 1 }
          //       }
          //     }
          //   }
          // }
          return hook
        },
      },
    },
    pathIncludeNamespace(path, namespace) {
      if (t.not(path)) {
        return false
      }
      if (t.not(t.isType(path, 'String'))) {
        return false
      }
      return path.includes(namespace)
    },
  }
})
