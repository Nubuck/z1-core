import { api } from './api'

export default (z, props) =>
  z.featureBox.create(
    'machineAccount',
    p => {
      return {
        api: [api(z, p)],
        hooks: {},
        parts: {},
      }
    },
    {
      adapter: 'nedb',
      models: null,
      serviceFactory: {},
    }
  )(props)
