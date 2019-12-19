import { task } from '@z1/lib-feature-box-server-core'

// main
export const isAction = task(t => (actions = []) => hook =>
  t.not(t.isNil(t.find(action => t.eq(action, hook.data.action), actions)))
)
