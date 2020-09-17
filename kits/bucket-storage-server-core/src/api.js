import FeathersBlogService from 'feathers-blob'
import FsBlobStore from 'fs-blob-store'
import Dauria from 'dauria'
import Multer from 'multer'
import mime from 'mime-types'
import pt from 'path'

// ctx
import { SERVICES, PATHS } from './context'
const dataURIName = (dataURI) => {
  // Split metadata from data
  const splitted = dataURI.split(',')
  // Split params
  const params = splitted[0].split(';')
  // Filter the name property from params
  const properties = params.filter((param) => {
    return param.split('=')[0] === 'name'
  })
  // Look for the name and use unknown if no name property.
  let name
  if (properties.length !== 1) {
    name = 'unknown'
  } else {
    // Because we filtered out the other property,
    // we only have the name case here.
    name = properties[0].split('=')[1]
  }
  return decodeURIComponent(name)
}

// main
export const api = (z, props) =>
  z.featureBox.fn((t, a) =>
    z.featureBox.api.create('bucketStorage', {
      models: props.models,
      services(s, { auth, common, data }) {
        // parts
        const safeMeta = (ctx) => {
          const rawMeta = t.path(PATHS.DATA_META, ctx)
          return t.isType(rawMeta, 'string')
            ? t.tryCatch(
                () => {
                  return JSON.parse(rawMeta)
                },
                () => {
                  return {}
                }
              )()
            : rawMeta
        }
        const stripUri = (ctx) => {
          if (t.has('result')(ctx)) {
            ctx.result = t.omit(['uri'], ctx.result)
          }
          return ctx
        }
        const dbId = t.eq(props.adapter, 'nedb') ? '_id' : 'id'
        const withAuthors = (keys) => (ctx) => {
          ctx.data = t.merge(ctx.data, {
            [keys.author]: t.pathOr(null, ['params', 'user', dbId], ctx),
            [keys.role]: t.at('params.user.role', ctx),
          })
          return ctx
        }
        const withQueryParams = (ctx) => {
          const includeAuthors = t.at('params.query.includeAuthors', ctx)
          if (t.isNil(includeAuthors)) {
            return ctx
          }
          ctx.params.query = t.omit(['includeAuthors'], ctx.params.query)
          ctx.params.includeAuthors = includeAuthors
          return ctx
        }
        const withAuthorJoins = common.when(
          (ctx) => t.atOr(false, 'params.includeAuthors', ctx),
          common.fastJoin((ctx) => {
            return {
              joins: {
                creator() {
                  return async (file) => {
                    if (t.isNil(file.createdBy)) {
                      return file
                    }
                    const creatorService = t.or(
                      t.eq('user', file.creatorRole),
                      t.eq('admin', file.creatorRole)
                    )
                      ? 'users'
                      : 'machine-logins'
                    const result = await ctx.app
                      .service(creatorService)
                      .get(file.createdBy)
                    file.creator = t.eq('users', creatorService)
                      ? t.merge(
                          t.pick(
                            ['name', 'surname', 'email', 'role', 'status'],
                            result || {}
                          ),
                          { type: 'user' }
                        )
                      : t.merge(result || {}, {
                          type: 'machine',
                        })
                    return file
                  }
                },
                updater() {
                  return async (file) => {
                    if (t.isNil(file.updatedBy)) {
                      return file
                    }
                    const updaterService = t.or(
                      t.eq('user', file.updaterRole),
                      t.eq('admin', file.updaterRole)
                    )
                      ? 'users'
                      : 'machine-logins'
                    const result = await ctx.app
                      .service(updaterService)
                      .get(file.updatedBy)
                    file.updater = t.eq('users', updaterService)
                      ? t.merge(
                          t.pick(
                            ['name', 'surname', 'email', 'role', 'status'],
                            result || {}
                          ),
                          { type: 'user' }
                        )
                      : t.merge(t.pick(['login'], result || {}), {
                          type: 'machine',
                        })
                    return file
                  }
                },
              },
            }
          })
        )
        //sql hooks
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
          return JSON.parse(val)
        }

        const safeStringify = (val) => {
          if (t.or(t.ofType('object', val), t.ofType('array', val))) {
            return JSON.stringify(val)
          }
          return '{}'
        }
        const withSafeParse = (keys = []) => (ctx) => {
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
          } else {
            if (t.not(t.isNil(t.pathOr(null, ['result', '_id'], ctx)))) {
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
            }
          }
          return ctx
        }
        const withSafeStringify = (keys = []) => (ctx) => {
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
        }
        // registry
        const regKeys = [
          '_id',
          'fileId',
          'mimeType',
          'originalName',
          'encoding',
          'size',
          'ext',
          'createdBy',
          'creatorRole',
          'updatedBy',
          'updaterRole',
          'createdAt',
          'updatedAt',
        ]
        const regJson = ['extra']
        s([props.adapter, SERVICES.REGISTRY], props.serviceFactory, {
          hooks: {
            before: {
              all: [auth.authenticate('jwt')],
              get: [withQueryParams],
              find: [data.safeFindMSSQL, withQueryParams],
              create: [
                data.withIdUUIDV4,
                withQueryParams,
                withAuthors({ author: 'createdBy', role: 'creatorRole' }),
                common.setNow('createdAt', 'updatedAt'),
                (ctx) => {
                  ctx.data = t.merge(t.pick(regKeys, ctx.data), {
                    extra: t.omit(regKeys, ctx.data),
                  })
                  return ctx
                },
                withSafeStringify(regJson),
              ],
              patch: [
                withQueryParams,
                withAuthors({ author: 'updatedBy', role: 'updaterRole' }),
                common.setNow('updatedAt'),
                (ctx) => {
                  ctx.data = t.merge(t.pick(regKeys, ctx.data), {
                    extra: t.omit(regKeys, ctx.data),
                  })
                  return ctx
                },
                withSafeStringify(regJson),
              ],
            },
            after: {
              get: [withAuthorJoins, withSafeParse(regJson)],
              find: [withAuthorJoins, withSafeParse(regJson)],
              create: [withAuthorJoins, withSafeParse(regJson)],
              patch: [withAuthorJoins, withSafeParse(regJson)],
            },
          },
        })
        // bucket
        s(
          SERVICES.STORAGE,
          (app) => {
            const storage = app.get('storage')
            if (storage) {
              const engine = t.prop('engine', storage)
              const bucket = t.prop('bucket', storage)
              const Model = t.eq(engine, 'fs')
                ? FsBlobStore(z.featureBox.fs.path(bucket))
                : null
              if (Model) {
                app.use(
                  `/${SERVICES.STORAGE}`,
                  Multer({
                    limits: {
                      fileSize: 25 * 1024 * 1024,
                      fieldSize: 25 * 1024 * 1024,
                    },
                  }).single('uri'),
                  function (req, res, next) {
                    req.feathers.file = req.file
                    next()
                  },
                  FeathersBlogService({
                    Model,
                  })
                )
              }
            }
            return null
          },
          {
            hooks: {
              before: {
                find: [data.safeFindMSSQL],
                create: [
                  auth.authenticate('jwt'),
                  (ctx) => {
                    const dataUri = t.path(PATHS.DATA_URI, ctx)
                    const meta = safeMeta(ctx)
                    if (t.and(t.not(dataUri), t.path(PATHS.PARAMS_FILE, ctx))) {
                      const mimeType = t.pathOr('', PATHS.PARAMS_FILE_MIME, ctx)
                      const originalName = decodeURIComponent(
                        t.pathOr('', PATHS.PARAMS_FILE_ORIGINAL, ctx)
                      )
                      const ext = t.noLen(originalName)
                        ? mime.extension(mimeType)
                        : pt.extname(originalName)
                      ctx.data = {
                        uri: Dauria.getBase64DataURI(
                          t.path(PATHS.PARAMS_FILE_BUFFER, ctx),
                          mimeType
                        ),
                        meta: t.merge(meta, {
                          mimeType,
                          ext: t.replace('.', '', ext),
                          originalName,
                          encoding: t.path(PATHS.PARAMS_FILE_ENCODING, ctx),
                          size: t.path(PATHS.PARAMS_FILE_SIZE, ctx),
                        }),
                      }
                    } else if (dataUri) {
                      const content = Dauria.parseDataURI(dataUri)
                      const originalName = dataURIName(dataUri)
                      const ext = t.noLen(originalName)
                        ? mime.extension(content.MIME)
                        : pt.extname(originalName)
                      ctx.data = t.merge(ctx.data, {
                        meta: t.merge(meta, {
                          mimeType: content.MIME,
                          ext: t.replace('.', '', ext),
                          originalName,
                          encoding: content.mediaType,
                          size: content.buffer.length,
                        }),
                      })
                    }
                    return ctx
                  },
                ],
                remove: [auth.authenticate('jwt')],
              },
              after: {
                create: [
                  stripUri,
                  async (ctx) => {
                    ctx.result.meta = null
                    const id = t.path(PATHS.RESULT_ID, ctx)
                    const meta = safeMeta(ctx)
                    if (t.or(t.not(id), t.not(meta))) {
                      return ctx
                    }
                    const [findError, foundFiles] = await a.of(
                      ctx.app.service(SERVICES.REGISTRY).find({
                        query: {
                          fileId: id,
                        },
                      })
                    )
                    if (t.or(findError, t.not(foundFiles.data))) {
                      return ctx
                    }
                    const registryFile = t.head(foundFiles.data)
                    const nextMeta = t.merge(meta, {
                      fileId: id,
                    })
                    if (registryFile) {
                      const [patchError, result] = await a.of(
                        ctx.app
                          .service(SERVICES.REGISTRY)
                          .patch(registryFile[dbId], nextMeta, {
                            includeAuthors: true,
                            user: t.at('params.user', ctx),
                          })
                      )
                      if (t.not(patchError)) {
                        ctx.result.meta = result
                      }
                    } else {
                      const [createError, result] = await a.of(
                        ctx.app.service(SERVICES.REGISTRY).create(nextMeta, {
                          includeAuthors: true,
                          user: t.at('params.user', ctx),
                        })
                      )
                      if (t.not(createError)) {
                        ctx.result.meta = result
                      }
                    }
                    return ctx
                  },
                ],
                remove: [
                  async (ctx) => {
                    ctx.result.meta = null
                    const id = t.path(PATHS.RESULT_ID, ctx)
                    if (t.not(id)) {
                      return ctx
                    }
                    const [findError, foundFiles] = await a.of(
                      ctx.app.service(SERVICES.REGISTRY).find({
                        query: {
                          fileId: id,
                        },
                      })
                    )
                    if (t.or(findError, t.not(foundFiles.data))) {
                      return ctx
                    }
                    const registryFile = t.head(foundFiles.data)
                    if (registryFile) {
                      const [removeError, removeResult] = await a.of(
                        ctx.app
                          .service(SERVICES.REGISTRY)
                          .remove(registryFile[dbId])
                      )
                      if (t.not(removeError)) {
                        ctx.result.meta = {
                          id: removeResult[dbId],
                        }
                      }
                    }
                    return ctx
                  },
                ],
              },
            },
          }
        )
        // content
        s(SERVICES.CONTENT, (app) => {
          app.get(`/${SERVICES.CONTENT}/:id`, function (req, res, next) {
            // find id in params
            const id = t.path(PATHS.PARAMS_ID, req)
            // find id in api
            app
              .service(SERVICES.STORAGE)
              .get(id)
              .then((rawContent) => {
                // validate
                if (t.not(rawContent)) {
                  next()
                } else {
                  app
                    .service(SERVICES.REGISTRY)
                    .find({ query: { fileId: id } })
                    .then((result) => {
                      try {
                        const regFile = t.head(result.data) || {}
                        // decode uri with Dauria.parseDataURI()
                        const content = Dauria.parseDataURI(rawContent.uri)
                        // yield content
                        res
                          .set({
                            'Access-Control-Expose-Headers':
                              'Content-Disposition, Content-Length, X-Content-Transfer-Id',
                            'Content-Type': content.MIME,
                            'Content-Length': content.buffer.length,
                            'Content-Disposition': `inline; filename="${regFile.originalName}"`,
                            'X-Content-Transfer-Id': id,
                          })
                          .status(200)
                          .send(content.buffer)
                      } catch (error) {
                        next(error)
                      }
                    })
                    .catch((err) => next(err))
                }
              })
              .catch((contentError) => next(contentError))
          })
          return null
        })
      },
    })
  )
