// bump 47
import * as core from '@z1/lib-state-box-core'
import { createLogger } from 'redux-logger'

export const createStateStore = function(props) {
  return core.createStateStore(
    core.Task(t => t.merge(props, { logger: createLogger() }))
  )
}
export const createStateBox = core.createStateBox
export const combineStateBoxes = core.combineStateBoxes
export const reloadStateStore = core.reloadStateStore
export const task = core.Task
