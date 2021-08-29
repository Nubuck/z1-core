import z from '@z1/lib-feature-box'

// parts
import parts from '../parts'

// features
import layoutKit from './layout'
import accountKit from './account'
import pages from './pages'
// import machines from './machines'
// import cloudStorage from './cloud-storage'

// unpack
const layout = layoutKit(parts)
const core = {
  ...parts,
  state: {
    ...parts.state,
    ...layout.parts,
  },
}
const account = accountKit(core)

// context
const ctx = {
  ...core,
  state: {
    ...core.state,
    ...account.parts,
  },
}

// main
export { api } from '../parts'
export const features = z.combine([
  layout,
  account,
  pages(ctx),
  // machines(ctx),
  // cloudStorage(ctx),
])
