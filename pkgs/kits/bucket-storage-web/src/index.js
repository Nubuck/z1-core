import { toBlob as tb, withRest as wr } from './main'
export const toBlob = tb
export const withRest = wr
const bsw = {
  toBlob,
  withRest,
}
export default bsw
