import mx from '@z1/lib-feature-macros'

// parts
import { home } from './home'
import {about} from './about'

// main
export const views = mx.routeView.combine([home,about])
