export function strategy(z, adapter) {
  let { AuthenticationBaseStrategy } = z.FeathersAuth
  // Webpack compiler butchers classes defined in functions.
  // Classes as a top level API is cringe AF and results in hacks like this.
  AuthenticationBaseStrategy.prototype.authenticate = z.featureBox.fn(
    (t, a) =>
      async function authenticate(payload) {
        const dbId = '_id'
        const payloadErrorMsg =
          'Machine account authentication requires a hashId field'
        if (t.not(t.has('hashId')(payload))) {
          throw new z.FeathersErrors.Unprocessable(payloadErrorMsg)
        }
        if (t.noLen(payload.hashId)) {
          throw new z.FeathersErrors.Unprocessable(payloadErrorMsg)
        }
        const loginResult = await z.loginByHashId(this.app, payload.hashId)
        const invalidErrorMsg = 'Invalid Login'
        if (t.not(loginResult.exists)) {
          throw new z.FeathersErrors.NotAuthenticated(invalidErrorMsg)
        }
        const [machineError, machine] = await a.of(
          this.app
            .service('machines')
            .get(loginResult.login.machineId, { excludeLogins: true })
        )
        if (machineError) {
          throw new z.FeathersErrors.Unprocessable(machineError.message)
        }
        if (t.isNil(machine)) {
          throw new z.FeathersErrors.NotAuthenticated(invalidErrorMsg)
        }
        return {
          authentication: { strategy: 'machine' },
          user: {
            [dbId]: loginResult.login[dbId],
            role: loginResult.login.role,
            machine,
            login: loginResult.login,
          },
        }
      }
  )
  return { MachineStrategy: AuthenticationBaseStrategy }
}
