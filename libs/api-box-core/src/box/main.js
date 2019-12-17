import { task } from '@z1/preset-task'

// parts
import { combine } from './combine'
import { compose } from './compose'
import { create } from './create'

// main
export const box = task(t => ctx => {
  const Create = create(ctx)
  
  return {
    create: null,
    compose: null,
    combine: null,
  }
})
