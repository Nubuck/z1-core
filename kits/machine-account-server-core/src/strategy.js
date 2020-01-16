export function strategy(z) {
  let { AuthenticationBaseStrategy } = z.FeathersAuth
  // Webpack compiler butchers classes defined in functions.
  // Classes as a top level API is cringe AF and results in hacks like this.
  AuthenticationBaseStrategy.prototype.authenticate = z.featureBox.fn(
    (t, a) =>
      async function authenticate(payload) {
        const payloadErrorMsg =
          'Machine account authentication requires a hashId field'
        if (t.not(t.has('hashId')(payload))) {
          throw new z.FeathersErrors.Unprocessable(payloadErrorMsg)
        }
        if (t.isZeroLen(payload.hashId)) {
          throw new z.FeathersErrors.Unprocessable(payloadErrorMsg)
        }
        const [userError, userResult] = await a.of(
          this.app.service('machine-users').find({
            query: {
              hashId: payload.hashId,
            },
          })
        )
        if (userError) {
          throw new z.FeathersErrors.Unprocessable(userError.message)
        }
        const invalidErrorMsg = 'Invalid Login'
        if (t.isNil(userResult)) {
          throw new z.FeathersErrors.NotAuthenticated(invalidErrorMsg)
        }
        if (t.eq(userResult.total, 0)) {
          throw new z.FeathersErrors.NotAuthenticated(invalidErrorMsg)
        }
        const user = t.head(userResult.data)
        const [machineError, machine] = await a.of(
          this.app.service('machine-users').get(user.machineId)
        )
        if (machineError) {
          throw new z.FeathersErrors.Unprocessable(machineError.message)
        }
        if (t.isNil(machine)) {
          throw new z.FeathersErrors.NotAuthenticated(invalidErrorMsg)
        }
        return {
          authentication: { strategy: this.name },
          machine,
          user,
        }
      }
  )
  return { MachineStrategy: AuthenticationBaseStrategy }
}
