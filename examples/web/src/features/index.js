import { featureBox as fbx } from '@z1/lib-feature-box'

// features
import account from './account'

// ctx
const ctx = { ui: {} }

// main
export const features = fbx.combine([account(ctx)])
