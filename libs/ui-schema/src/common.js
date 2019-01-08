import { task } from '@z1/preset-task'

// exports
export const tailHead = task(
  t => t.compose(t.head, t.tail),
)
export const camelKeys = task(
  t => t.compose(
    t.map(item => t.caseTo.camelCase(item)),
    t.keys,
  ),
)