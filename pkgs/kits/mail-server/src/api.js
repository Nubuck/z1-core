import z from '@z1/lib-feature-box-server'

// parts
import parts from './parts'

// main
export const api = (ctx) => z.api.create('mail', parts(ctx))
