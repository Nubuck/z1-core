import mx from '@z1/lib-feature-macros'

// parts
import { signIn } from './signIn'
import { signUp } from './signUp'
import { unauthorized } from './unauthorized'

// main
export const views = mx.routeView.combine([unauthorized, signIn, signUp])
