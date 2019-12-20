import { task } from '@z1/preset-task'

// main
export const adapters = task(t => ctx => {
  return {
    configure(app) {
      const storeName = 'adapterStore'
      const toolsName = 'dbTools'
      app.set(storeName, {})
      app.set(toolsName, {
        dbConfig(adapterName) {
          return t.pathOr(null, [adapterName], app.get('db'))
        },
        get(adapterName) {
          return t.pathOr({}, [adapterName], app.get(storeName))
        },
        set(adapterName, adapter) {
          app.set(
            storeName,
            t.merge(app.get(storeName), {
              [adapterName]: adapter,
            })
          )
          return null
        },
        models: {
          get(adapterName) {
            return t.pathOr(null, [adapterName, 'models'], app.get(storeName))
          },
          add(adapterName, modelName, factory) {
            const currentStore = app.get(storeName)
            console.log('CURRENT STORE', currentStore)
            const adapterStore = currentStore[adapterName] || {}
            console.log('adap STORE', adapterStore)
            const nextStore = t.merge(currentStore, {
              [adapterName]: t.merge(adapterStore, {
                models: t.merge(adapterStore.models || {}, {
                  [modelName]: factory,
                }),
              }),
            })
            console.log('Next STORE', nextStore)
            app.set(storeName, nextStore)
            return null
          },
          create(modelId = [], factory = null) {
            const [adapterName, modelName] = modelId
            const dbTools = app.get(toolsName)
            // const adapter = dbTools.get(adapterName)
            dbTools.models.add(adapterName, modelName, factory)
            return null
          },
        },
        services: {
          get(adapterName) {
            return t.pathOr(null, [adapterName, 'services'], app.get(storeName))
          },
          add(adapterName, serviceName, factory) {
            const currentStore = app.get(storeName)
            const adapterStore = currentStore[adapterName]
            app.set(
              storeName,
              t.merge(currentStore, {
                [adapterName]: t.merge(adapterStore, {
                  services: t.merge(adapterStore.services || {}, {
                    [serviceName]: factory,
                  }),
                }),
              })
            )
            return null
          },
          create(serviceId, factory, hooksEvents) {
            const mode = t.isType(serviceId, 'Array') ? 'adapter' : 'manual'
            const dbTools = app.get(toolsName)
            if (t.eq(mode, 'adapter')) {
              const [adapterName, serviceName] = serviceId
              const adapter = dbTools.get(adapterName)
              console.log('APADTER', adapter)
              dbTools.services.add(
                adapterName,
                serviceName,
                adapter.service(serviceName, factory, hooksEvents)
              )
            } else {
              app.configure(() => {
                const service = factory(app)
                const serviceName = ctx.safeServiceName(serviceId)
                if (t.not(t.isNil(service))) {
                  app.use(`/${serviceName}`, service)
                }
                dbTools.services.wire(serviceName, hooksEvents)
              })
            }
            return null
          },
          wire(serviceName, hooksEvents) {
            const service = app.service(serviceName)
            console.log('WIRE', service)
            if (t.and(hooksEvents, service)) {
              if (ctx.hookSignature(hooksEvents)) {
                service.hooks(hooksEvents)
              } else if (ctx.hookAndEventSignature(hooksEvents)) {
                if (t.has('hooks')(hooksEvents)) {
                  service.hooks(hooksEvents.hooks)
                }
                if (t.has('events')(hooksEvents)) {
                  if (t.isType(hooksEvents.events, 'Object')) {
                    t.forEach(eventKey => {
                      service.on(eventKey, (data, context) => {
                        t.pathOr(
                          () => {},
                          [eventKey],
                          hooksEvents.events
                        )(data, context)
                      })
                    }, t.keys(hooksEvents.events) || [])
                  }
                }
              }
            }
            return null
          },
        },
      })
      t.forEach(adapter => {
        adapter(app)
      }, t.pathOr([], ['adapters'], ctx))
    },
  }
})
