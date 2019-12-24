import { task } from '@z1/preset-task'

// main
export const combine = task(t => ctx => {
  return (boxes = []) => {
    const nextBoxes = t.reduce(
      (collection, box) => {
        return {
          models: t.notType(box.models, 'Function')
            ? collection.models
            : t.concat(collection.models, [box.models]),
          services: t.notType(box.services, 'Function')
            ? collection.services
            : t.concat(collection.services, [box.services]),
          channels: t.notType(box.channels, 'Function')
            ? collection.channels
            : t.concat(collection.channels, [box.channels]),
          lifecycle: t.notType(box.lifecycle, 'Function')
            ? collection.lifecycle
            : t.concat(collection.lifecycle, [box.lifecycle]),
        }
      },
      {
        models: [],
        services: [],
        channels: [],
        lifecycle: [],
      },
      boxes
    )
    const partialBoxes = t.pick(['models', 'services', 'channels'], nextboxes)
    return t.merge(partialBoxes, {
      lifecycle: key => app => {
        t.forEach(action => {
          if (t.isType(action, 'Function')) {
            action(key, app)
          }
        }, nextBoxes.lifecycle || [])
      },
    })
  }
})
