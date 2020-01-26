import z from '@z1/lib-feature-box'

// parts
import parts from '../parts'

// features
import layout from './layout'
import account from './account'
import pages from './pages'

// main
export const features = z.combine([layout(parts), account(parts), pages(parts)])
