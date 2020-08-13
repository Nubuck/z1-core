import { api } from './api'
import checkPermissions from 'feathers-permissions'

// main
export default (z, props) =>
  z.featureBox.create(
    'account',
    (p) => {
      return {
        api: [api(z, p)],
        hooks: {
          checkPermissions
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
