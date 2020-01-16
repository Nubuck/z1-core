export function strategy(z) {
  let { AuthenticationBaseStrategy } = z.FeathersAuth
  // Webpack compiler butchers classes defined in functions.
  // Classes as a top level API is cringe AF and results in hacks like this.
  AuthenticationBaseStrategy.prototype.authenticate = z.featureBox.fn(
    (t, a) =>
      async function authenticate(auth, params) {
        return {
          machine: null,
          user: null,
        }
      }
  )
  return { MachineStrategy: AuthenticationBaseStrategy }
}
