import { task } from '@z1/preset-task'
import {
  FeathersAuth,
  FeathersAuthLocal,
  FeathersOAuth,
} from '@z1/preset-feathers-server-core'

// main
export const auth = task((t) => (ctx) => (lifecycle) => (app) => {
  const authentication = new FeathersAuth.AuthenticationService(app)
  authentication.register('jwt', new FeathersAuth.JWTStrategy())
  authentication.register('local', new FeathersAuthLocal.LocalStrategy())
  app.set('authenticationService', authentication)
  app.configure(lifecycle)
  app.use('/authentication', app.get('authenticationService'))
  app.service('authentication').hooks({
    before: {
      create: [
        (hook) => {
          const email = t.at('data.email', hook)
          if (t.notNil(email)) {
            hook.data.email = t.to.lowerCase(email)
          }
          return hook
        },
      ],
    },
  })
  app.configure(FeathersOAuth.expressOauth())
})
