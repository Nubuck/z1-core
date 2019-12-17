import { task } from '@z1/preset-task'

// main
export const app = task(t => ctx => {
  return {
    create: null,
    reload: null,
  }
})
