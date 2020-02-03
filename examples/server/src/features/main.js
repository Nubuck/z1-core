import z, { FeathersErrors, FeathersAuth } from '@z1/lib-feature-box-server'

// sql kits
// import account from '@z1/kit-account-server'
// import bucketStorage from '@z1/kit-bucket-storage-server'
// import machineAccount from '@z1/kit-machine-account-server'

// nedb kits
import account from '@z1/kit-account-server-nedb'
import bucketStorage from '@z1/kit-bucket-storage-server-nedb'
import machineAccount from '@z1/kit-machine-account-server-nedb'

// feature ctx
const core = {
  featureBox: z,
  FeathersErrors,
  FeathersAuth,
}

// exports
export const features = z.combine([
  account(core),
  bucketStorage(core),
  machineAccount(core),
])
