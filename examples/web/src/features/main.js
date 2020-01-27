import z from '@z1/lib-feature-box'

// parts
import parts from '../parts'

// features
import layoutKit from './layout'
import account from './account'
import pages from './pages'

// unpack
const layout = layoutKit(parts)
// context
const ctx = z.fn(t => ({
  ui: parts.ui,
  state: t.merge(parts.state, layout.parts),
}))

// main
export const features = z.combine([layout, account(ctx), pages(ctx)])
