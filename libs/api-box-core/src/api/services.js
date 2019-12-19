import { task } from '@z1/preset-task'

// main
export const services = task((t, a) => ctx => {
  return {
    init(app) {
      const createService = (name, factory, props) => {
        const serviceType = t.isType(name, 'String') ? 'manual' : 'adapter'
        if (t.eq(serviceType, 'manual')) {
        }
        const dbTasks = app.get('dbTasks')
        const [adapterName, serviceName] = name
        const adapter = dbTasks.getAdapter(adapterName)
        if (t.not(t.isNil(adapter))) {
        }
      }
      app.set('createService', createService)
    },
  }
})
