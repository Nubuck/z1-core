import { api } from './api'

export default (z, props) =>
  z.featureBox.create(
    'account',
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
      serviceFactory: () => ({}),
    }
  )(props)
