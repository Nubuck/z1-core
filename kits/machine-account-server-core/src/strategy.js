export const strategy = z =>
  z.featureBox.fn(
    (t, a) =>
      class MachineStategy extends z.FeathersAuth.AuthenticationBaseStrategy {
        async authenticate(authentication, params) {
          return {
            machine: null,
            user: null,
          }
        }
      }
  )
