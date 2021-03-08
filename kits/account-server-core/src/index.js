import { api } from './api'
import checkPermissions from 'feathers-permissions'

// z contains the core object in the server main
// main
export default (z, props) =>
  z.featureBox.create(
    'account',
    (p) => {
      return {
        api: [api(z, p)],
        hooks: {
          checkPermissions,
        },
        parts: {},
      }
    },
    {
      adapter: 'nedb',
      models: null,
      serviceFactory: () => ({}),
    }
  )(props)
