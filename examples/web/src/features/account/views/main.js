import mx from '@z1/lib-feature-macros'

// parts
import { signIn } from './signIn'
import { signUp } from './signUp'
import { notAuthorized } from './not-authorized'

// main
export const views = mx.routeView.combine([notAuthorized, signIn, signUp])
