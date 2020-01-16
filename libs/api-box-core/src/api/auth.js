import { task } from '@z1/preset-task'
import {
  FeathersAuth,
  FeathersAuthLocal,
  FeathersOAuth,
} from '@z1/preset-feathers-server-core'

// main
export const auth = task(t => ctx => lifecycle => app => {
  const authentication = new FeathersAuth.AuthenticationService(app)
  authentication.register('jwt', new FeathersAuth.JWTStrategy())
  authentication.register('local', new FeathersAuthLocal.LocalStrategy())
  app.set('authenticationService', authentication)
  app.configure(lifecycle)
  app.use('/authentication', app.get('authenticationService'))
  app.configure(FeathersOAuth.expressOauth())
})
