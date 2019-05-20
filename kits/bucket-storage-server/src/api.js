import { createApiBox, task } from '@z1/lib-feature-box-server'
import { Fs } from '@z1/preset-tools'
import FeathersBlogService from 'feathers-blob'
import S3BlobStore from 's3-blob-store'
import FsBlobStore from 'fs-blob-store'
import Dauria from 'dauria'
import Multer from 'multer'
import AWS from 'aws-sdk'

import {
  PATHS,
} from './context'

const SERVICES = {
  REGISTRY: 'bucket-registry',
  STORAGE: 'bucket-storage',
  CONTENT: 'bucket-content',
}

const stripUri = task(
  t => hook => {
    if (t.has('result')(hook)) {
      hook.result = t.omit([ 'uri' ], hook.result)
    }
    return hook
  },
)

export const storageApi = createApiBox({
  models(m, T) {
    return [
      m('bucket_registry', {
        id: {
          type: T.UUID,
          primaryKey: true,
        },
        fileId: {
          type: T.STRING,
          allowNull: false,
        },
        mimeType: {
          type: T.STRING,
          allowNull: false,
        },
        originalName: {
          type: T.STRING,
          allowNull: false,
        },
        encoding: {
          type: T.STRING,
        },
        size: {
          type: T.INTEGER,
          allowNull: false,
        },
      }, {
        hooks: {
          beforeCount(options) {
            options.raw = true
          },
        },
      }),
    ]
  },
  services(s, models, { auth, data }) {
    return [
      s(SERVICES.REGISTRY, {
        Model: models.bucket_registry,
      }, {
        hooks: {
          before: {
            all: [
              auth.authenticate('jwt'),
            ],
            find:[
              data.safeFindMSSQL
            ],
            create: [
              data.withIdUUIDV4,
            ],
          },
        },
      }),
      s(SERVICES.STORAGE, task(
        t => app => {
          const storage = app.get('storage')
          if (storage) {
            const engine = t.prop('engine', storage)
            const bucket = t.prop('bucket', storage)
            const Model = t.eq(engine, 's3')
              ? S3BlobStore({
                client: new AWS.S3(app.get('s3')),
                bucket,
              })
              : t.eq(engine, 'fs')
                ? FsBlobStore(Fs.path(bucket))
                : null
            if (Model) {
              app.use(
                `/${SERVICES.STORAGE}`,
                Multer().single('uri'),
                function (req, res, next) {
                  req.feathers.file = req.file
                  next()
                },
                FeathersBlogService({
                  Model,
                }),
              )
            }
          }
        }),
        {
          hooks: {
            before: {
              find:[
                data.safeFindMSSQL
              ],
              create: [
                auth.authenticate('jwt'),
                task(
                  t => hook => {
                    if (t.and(
                        t.not(t.path(PATHS.DATA_URI, hook)),
                        t.path(PATHS.PARAMS_FILE, hook),
                      )) {
                      hook.data = {
                        uri: Dauria.getBase64DataURI(
                          t.path(PATHS.PARAMS_FILE_BUFFER, hook),
                          t.path(PATHS.PARAMS_FILE_MIME, hook),
                        ),
                        meta: {
                          mimeType: t.path(PATHS.PARAMS_FILE_MIME, hook),
                          originalName: t.path(PATHS.PARAMS_FILE_ORIGINAL, hook),
                          encoding: t.path(PATHS.PARAMS_FILE_ENCODING, hook),
                          size: t.path(PATHS.PARAMS_FILE_SIZE, hook),
                        },
                      }
                    }
                    return hook
                  },
                ),
              ],
              remove: [
                auth.authenticate('jwt'),
              ],
            },
            after: {
              create: [
                stripUri,
                task(
                  (t, a) => async hook => {
                    hook.result.meta = null
                    const id = t.path(PATHS.RESULT_ID, hook)
                    const meta = t.path(PATHS.DATA_META, hook)
                    if (t.or(
                        t.not(id),
                        t.not(meta),
                      )) {
                      return hook
                    }
                    const [ findError, foundFiles ] = await a.of(
                      hook
                        .app
                        .service(SERVICES.REGISTRY)
                        .find({
                          query: {
                            fileId: id,
                          },
                        }),
                    )
                    if (t.or(
                        findError,
                        t.not(foundFiles.data),
                      )) {
                      return hook
                    }
                    const registryFile = t.head(foundFiles.data)
                    const nextMeta = t.merge(
                      meta,
                      { fileId: id },
                    )
                    if (registryFile) {
                      const [ patchError, result ] = await a.of(
                        hook
                          .app
                          .service(SERVICES.REGISTRY)
                          .patch(
                            registryFile.id,
                            nextMeta,
                          ),
                      )
                      if (t.not(patchError)) {
                        hook.result.meta = result
                      }
                    }
                    else {
                      const [ createError, result ] = await a.of(
                        hook
                          .app
                          .service(SERVICES.REGISTRY)
                          .create(nextMeta),
                      )
                      if (t.not(createError)) {
                        hook.result.meta = result
                      }
                    }
                    return hook
                  },
                ),
              ],
              remove: [
                task(
                  (t, a) => async hook => {
                    hook.result.meta = null
                    const id = t.path(PATHS.RESULT_ID, hook)
                    if (t.not(id)) {
                      return hook
                    }
                    const [ findError, foundFiles ] = await a.of(
                      hook
                        .app
                        .service(SERVICES.REGISTRY)
                        .find({
                          query: {
                            fileId: id,
                          },
                        }),
                    )
                    if (t.or(
                        findError,
                        t.not(foundFiles.data),
                      )) {
                      return hook
                    }
                    const registryFile = t.head(foundFiles.data)
                    if (registryFile) {
                      const [ removeError, removeResult ] = await a.of(
                        hook
                          .app
                          .service(SERVICES.REGISTRY)
                          .remove(registryFile.id),
                      )
                      if (t.not(removeError)) {
                        hook.result.meta = {
                          id: removeResult.id,
                        }
                      }
                    }
                    return hook
                  },
                ),
              ],
            },
          },
        },
      ),
      s(SERVICES.CONTENT, task(
        (t, a) => app => {
          app.get(
            `/${SERVICES.CONTENT}/:id`,
            function (req, res, next) {
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
                  }
                  else {
                    try {
                      // decode uri with Dauria.parseDataURI()
                      const content = Dauria.parseDataURI(rawContent.uri)
                      // yield content
                      res
                        .set({
                          'Content-Type': content.MIME,
                          'Content-Length': content.buffer.length,
                        })
                        .status(200)
                        .send(content.buffer)
                    }
                    catch (error) {
                      next(error)
                    }
                  }
                })
                .catch(contentError => next(contentError))
            },
          )
        },
      )),
    ]
  },
})