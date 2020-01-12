import zbx from '@z1/lib-feature-box'

// features
// import account from './account'
import landing from './landing'

// ctx
const ctx = { ui: {} }

// main
export default zbx.combine([landing(ctx)])
