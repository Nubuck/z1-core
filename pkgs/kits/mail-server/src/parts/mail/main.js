import services from './services'

export const part = (ctx) => ({
  services: services(ctx),
})
