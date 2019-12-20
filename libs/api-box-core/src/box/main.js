import { task } from '@z1/preset-task'

// parts
import { combine } from './combine'
import { compose } from './compose'
import { create } from './create'

// main
export const box = task(t => ctx => {
  const Create = create(ctx)
  const Compose = compose(t.merge({ create: Create }, ctx))
  const Combine = combine(ctx)
  return {
    create: Create,
    compose: Compose,
    combine: Combine,
  }
})
