import { ui } from './ui'
import { state } from './state'
import _api from './api'

// main
export const api = _api
export const parts = { ui, state }
export default parts
