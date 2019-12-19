import { featureBox } from '@z1/lib-feature-box-server'

// kits
import account from '@z1/kit-account-server'

// feature ctx
const ctx = {}

// exports
export default featureBox.combine([account(ctx)])
