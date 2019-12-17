import { task } from '@z1/preset-task'

// main
export const api = task(t => ctx => {
  return {
    create: null,
    run: null,
    reload: null,
  }
})
