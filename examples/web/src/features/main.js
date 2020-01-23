import z from '@z1/lib-feature-box'

// parts
import parts from '../parts'

// features
import account from './account'
import pages from './pages'

// main
export const features = z.combine([account(parts), pages(parts)])
