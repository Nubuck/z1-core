export const strategy => z => {
  return class MachineStategy extends z.FeathersAuth.AuthenticationBaseStrategy {
    async authenticate(authentication, params) {
      return {
        machine: null,
        user: null,
      }
    }
  }
} 