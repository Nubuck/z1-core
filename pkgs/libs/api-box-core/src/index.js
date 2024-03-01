import { Fs, Execa } from '@z1/preset-tools'
import { Fn } from './main'
import { apiBoxCore as abx } from './main'
// outs
export {
  FeathersErrors,
  FeathersAuth,
  FeathersOAuth,
} from '@z1/preset-feathers-server-core'
export const task = Fn
export const fn = Fn
export const fs = Fs
export const execa = Execa
export const apiBoxCore = abx
export default abx
