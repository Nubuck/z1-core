export const strategy => ctx => {
  return class MachineStategy extends ctx.FeathersAuth.AuthenticationBaseStrategy {
    async authenticate(authentication, params) {
      return {
        machine: null,
        user: null,
      }
    }
  }
} 