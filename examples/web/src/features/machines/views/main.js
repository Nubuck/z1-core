import mx from '@z1/lib-feature-macros'

// parts
import { home } from './home'
import { profile } from './profile'
import { login } from './login'

// main
export const views = mx.view.combine([home, profile, login])
