import z from '@z1/lib-feature-box-server'
import features from './features'

process.on('unhandledRejection', (reason, p) =>
  console.log('Unhandled Rejection at: Promise ', p, reason)
)

let app = z.app.create(
  {
    boxes: features.api,
    apiPath: 'api',
    siteFolder: 'site',
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
    app = z.app.reload(app, { boxes: features.api })
  })
}
