export function strategy(z, adapter) {
  let { AuthenticationBaseStrategy } = z.FeathersAuth
  // Webpack compiler butchers classes defined in functions.
  // Classes as a top level API is cringe AF and results in hacks like this.
  // Object.defineProperty(AuthenticationBaseStrategy.prototype, 'configuration', {
  //   get() {
  //     const authConfig = this.authentication.configuration
  //     const config = super.configuration || {}
  //     console.log('MACHINE ACCOUNT GET', this.name, authConfig, config)
  //     return {
  //       // service: 'machine-account',
  //       entity: 'user',
  //       errorMessage: 'Invalid login',
  //       ...config,
  //     }
  //   },
  // })
  AuthenticationBaseStrategy.prototype.authenticate = z.featureBox.fn(
    (t, a) =>
      async function authenticate(payload) {
        const dbId = t.eq(adapter, 'nedb') ? '_id' : 'id'
        console.log(
          'MACHINE STRATEGY AUTHENTICATE',
          this.name,
          this.configuration,
          dbId
        )
        const payloadErrorMsg =
          'Machine account authentication requires a hashId field'
        if (t.not(t.has('hashId')(payload))) {
          throw new z.FeathersErrors.Unprocessable(payloadErrorMsg)
        }
        if (t.isZeroLen(payload.hashId)) {
          throw new z.FeathersErrors.Unprocessable(payloadErrorMsg)
        }
        const [loginError, loginResult] = await a.of(
          this.app.service('machine-logins').find({
            query: {
              hashId: payload.hashId,
            },
          })
        )
        if (loginError) {
          throw new z.FeathersErrors.Unprocessable(loginError.message)
        }
        const invalidErrorMsg = 'Invalid Login'
        if (t.isNil(loginResult)) {
          throw new z.FeathersErrors.NotAuthenticated(invalidErrorMsg)
        }
        if (t.eq(loginResult.total, 0)) {
          throw new z.FeathersErrors.NotAuthenticated(invalidErrorMsg)
        }
        const login = t.head(loginResult.data)
        const [machineError, machine] = await a.of(
          this.app
            .service('machines')
            .get(login.machineId, { excludeLogins: true })
        )
        if (machineError) {
          throw new z.FeathersErrors.Unprocessable(machineError.message)
        }
        if (t.isNil(machine)) {
          throw new z.FeathersErrors.NotAuthenticated(invalidErrorMsg)
        }
        return {
          authentication: { strategy: 'machine' },
          user: { [dbId]: login[dbId], machine, login },
        }
      }
  )
  return { MachineStrategy: AuthenticationBaseStrategy }
}
