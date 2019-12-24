import { apiBox } from '@z1/lib-feature-box-server'

// main
import features from './features'

process.on('unhandledRejection', (reason, p) =>
  console.log('Unhandled Rejection at: Promise ', p, reason)
)

let app = apiBox.app.create(
  {
    boxes: features.api,
    apiPath: 'api',
    sitePath: 'site',
  },
  () =>
    app.api.log(
      `App Server started on http://${app.api.get('host')}:${app.api.get(
        'port'
      )}`
    )
)

if (module.hot) {
  module.hot.accept(['./features'], () => {
    app = apiBox.app.reload(app, { boxes: features.api })
  })
}
