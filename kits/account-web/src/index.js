import {
  authStatus as aus,
  authenticated as isAuth,
  skipViewsExcept401 as skip,
} from './fn'
import { authState } from './state'

// outs
export const authStatus = aus
export const authenticated = isAuth
export const skipViewsExcept401 = skip
export const accountState = authState
const aw = {
  authStatus,
  authenticated,
  skipViewsExcept401,
  accountState,
}
export default aw
