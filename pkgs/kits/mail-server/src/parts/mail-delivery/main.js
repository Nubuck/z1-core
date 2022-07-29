import models from './models'
import services from './services'
import lifecycle from './lifecycle'

export const part = (ctx) => ({
  models,
  services: services(ctx),
  lifecycle: lifecycle(ctx),
})
