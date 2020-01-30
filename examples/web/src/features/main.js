import z from '@z1/lib-feature-box'

// parts
import parts from '../parts'

// features
import layoutKit from './layout'
import account from './account'
import pages from './pages'
import machines from './machines'

// unpack
const layout = layoutKit(parts)

// context
const ctx = {
  ...parts,
  state: {
    ...parts.state,
    ...layout.parts,
  },
}

// main
export const features = z.combine([
  layout,
  account(ctx),
  pages(ctx),
  machines(ctx),
])
