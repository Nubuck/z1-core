import { ui } from './ui'
import { state } from './state'
import client from './api'

// main
export const api = client
export const parts = { ui, state }
export default parts
