// parts
import { services, machineAuthStrategy } from './parts'

// main
export const machineAccountApi = ({ models, createApiBox, FeathersErrors }) =>
  createApiBox({
    models,
    services: services({ FeathersErrors }),
    lifecycle: {
      authConfig(app) {
        machineAuthStrategy(app, { FeathersErrors })
      },
    },
  })
