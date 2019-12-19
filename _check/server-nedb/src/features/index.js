import { featureBox } from '@z1/lib-feature-box-server-nedb'

// kits
// import account from '@z1/kit-account-server-nedb'
// import bucketStorage from '@z1/kit-bucket-storage-server-nedb'

// features
import machineAccount from './machine-account'

// feature ctx
const ctx = {}

// exports
export default featureBox.combine([
  // account(ctx),
  // bucketStorage(ctx),
  machineAccount(ctx),
])
