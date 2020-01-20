import z from '@z1/lib-feature-box'

// features
import account from './account'
import pages from './pages'

// ctx
const ctx = { ui: {} }

// main
export const features = z.combine([account(ctx), pages(ctx)])
