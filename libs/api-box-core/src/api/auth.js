import { task } from '@z1/preset-task'
import {
  FeathersAuth,
  FeathersAuthLocal,
  FeathersOAuth,
} from '@z1/preset-feathers-server-core'

// main
export const auth = task(t => (app, lifecycle, authHooks) => {
  const authentication = new FeathersAuth.AuthenticationService(app)
  authentication.register('jwt', new FeathersAuth.JWTStrategy())
  authentication.register('local', new FeathersAuthLocal.LocalStrategy())

  app.use('/authentication', authentication)
  app.configure(FeathersOAuth.expressOauth())
  app.configure(lifecycle)
  // The `authentication` service is used to create a JWT.
  // The before `create` hook registers strategies that can be used
  // to create a new valid JWT (e.g. local or oauth2)
  const nextHooks = t.isType(authHooks, 'Object')
    ? authHooks
    : t.isType(authHooks, 'Function')
    ? authHooks(commonHooks, config)
    : {
        before: {
          create: [commonHooks.auth.authenticate(config.strategies)],
          remove: [commonHooks.auth.authenticate('jwt')],
        },
      }
  app.service('authentication').hooks(nextHooks)
})
