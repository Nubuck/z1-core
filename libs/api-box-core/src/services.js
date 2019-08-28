import { task } from '@z1/preset-task'

// parts
import { safeServiceName, hookSignature, hookAndEventSignature } from './common'

// INTERFACE:
// name: string
// service: object or function
// -> object:
// { Model: SequelizeModel, paginate:{} ... }
// -> function:
// app => {}
// modifier: object
// -> hooks:
// {
//    before: {
//      get: [],
//      find: [],
//      create: [],
//      patch: [],
//      remove: []
//    },
//    after: {
//      get: [],
//      find: [],
//      create: [],
//      patch: [],
//      remove: []
//    },
// }
// -> events:
// {
//    created(data, ctx){},
//    updated(data, ctx) {},
//    patched(data, ctx){},
//    removed(data, ctx){}
// }
export const makeCreateService = task(
  t => adapter => (name, service, modifier = undefined) => app => {
    if (t.isType(service, 'Function')) {
      app.configure(a =>
        service(a, props =>
          adapter(
            t.merge(props, {
              name,
              paginate: t.has('paginate')(props)
                ? props.paginate
                : app.get('paginate'),
            })
          )
        )
      )
    } else {
      const nextService = t.has('Model')(service)
        ? adapter(
            t.merge(t.omit(['Model', 'paginate'], service), {
              name,
              Model: service.Model,
              paginate: t.has('paginate')(service)
                ? service.paginate
                : app.get('paginate'),
            })
          )
        : service
      app.use(`/${safeServiceName(name)}`, nextService)
    }
    const registeredService = app.service(name)
    if (t.and(modifier, registeredService)) {
      if (hookSignature(modifier)) {
        registeredService.hooks(modifier)
      } else if (hookAndEventSignature(modifier)) {
        if (t.has('hooks')(modifier)) {
          registeredService.hooks(modifier.hooks)
        }
        if (t.has('events')(modifier)) {
          if (t.isType(modifier.events, 'Object')) {
            t.forEach(eventKey => {
              registeredService.on(eventKey, (data, context) => {
                t.path([eventKey], modifier.events)(data, context)
              })
            }, t.keys(modifier.events) || [])
          }
        }
      }
    }
    return registeredService
  }
)
