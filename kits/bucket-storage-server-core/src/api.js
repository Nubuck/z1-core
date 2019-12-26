import { task, fs } from '@z1/lib-feature-box-server-core'
import FeathersBlogService from 'feathers-blob'
import FsBlobStore from 'fs-blob-store'
import Dauria from 'dauria'
import Multer from 'multer'

// ctx
import { SERVICES, PATHS } from './context'

// main
export const api = task(
  (t, a) => ({ adapter, models, apiBox, serviceFactory }) =>
    apiBox.create({
      models,
      services(s, { auth, common, data }) {
        const stripUri = ctx => {
          if (t.has('result')(ctx)) {
            ctx.result = t.omit(['uri'], ctx.result)
          }
          return ctx
        }
        // registry
        s(SERVICES.REGISTRY, serviceFactory, {
          hooks: {
            before: {
              all: [auth.authenticate('jwt')],
              find: [data.safeFindMSSQL],
              create: [data.withIdUUIDV4],
            },
          },
        })
        // bucket
        s(
          SERVICES.STORAGE,
          app => {
            const storage = app.get('storage')
            if (storage) {
              const engine = t.prop('engine', storage)
              const bucket = t.prop('bucket', storage)
              const Model = t.eq(engine, 'fs')
                ? FsBlobStore(fs.path(bucket))
                : null
              if (Model) {
                app.use(
                  `/${SERVICES.STORAGE}`,
                  Multer().single('uri'),
                  function(req, res, next) {
                    req.feathers.file = req.file
                    next()
                  },
                  FeathersBlogService({
                    Model,
                  })
                )
              }
              return null
            }
          },
          {
            hooks: {
              before: {
                find: [data.safeFindMSSQL],
                create: [
                  auth.authenticate('jwt'),
                  ctx => {
                    if (
                      t.and(
                        t.not(t.path(PATHS.DATA_URI, ctx)),
                        t.path(PATHS.PARAMS_FILE, ctx)
                      )
                    ) {
                      ctx.data = {
                        uri: Dauria.getBase64DataURI(
                          t.path(PATHS.PARAMS_FILE_BUFFER, ctx),
                          t.path(PATHS.PARAMS_FILE_MIME, ctx)
                        ),
                        meta: {
                          mimeType: t.path(PATHS.PARAMS_FILE_MIME, ctx),
                          originalName: t.path(PATHS.PARAMS_FILE_ORIGINAL, ctx),
                          encoding: t.path(PATHS.PARAMS_FILE_ENCODING, ctx),
                          size: t.path(PATHS.PARAMS_FILE_SIZE, ctx),
                        },
                      }
                    }
                    return ctx
                  },
                ],
                remove: [auth.authenticate('jwt')],
              },
              after: {
                create: [
                  stripUri,
                  async ctx => {
                    ctx.result.meta = null
                    const id = t.path(PATHS.RESULT_ID, ctx)
                    const meta = t.path(PATHS.DATA_META, ctx)
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
                    const nextMeta = t.merge(meta, { fileId: id })
                    if (registryFile) {
                      const [patchError, result] = await a.of(
                        ctx.app
                          .service(SERVICES.REGISTRY)
                          .patch(registryFile._id, nextMeta)
                      )
                      if (t.not(patchError)) {
                        ctx.result.meta = result
                      }
                    } else {
                      const [createError, result] = await a.of(
                        ctx.app.service(SERVICES.REGISTRY).create(nextMeta)
                      )
                      if (t.not(createError)) {
                        ctx.result.meta = result
                      }
                    }
                    return ctx
                  },
                ],
                remove: [
                  async ctx => {
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
                          .remove(registryFile._id)
                      )
                      if (t.not(removeError)) {
                        ctx.result.meta = {
                          id: removeResult._id,
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
        s(SERVICES.CONTENT, app => {
          app.get(`/${SERVICES.CONTENT}/:id`, function(req, res, next) {
            // find id in params
            const id = t.path(PATHS.PARAMS_ID, req)
            // find id in api
            app
              .service(SERVICES.STORAGE)
              .get(id)
              .then(rawContent => {
                // validate
                if (t.not(rawContent)) {
                  next()
                } else {
                  app
                    .service(SERVICES.REGISTRY)
                    .find({ query: { fileId: id } })
                    .then(result => {
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
                    .catch(err => next(err))
                }
              })
              .catch(contentError => next(contentError))
          })
        })
      },
    })
)
