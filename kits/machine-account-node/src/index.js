import sysInfo from 'systeminformation'
import hasha from 'hasha'
import { machine, hashCtx } from './main'
const ma = {
  machine,
  sysInfo,
  hasha,
  hashCtx,
}
export { accountState } from './main'
export default ma
