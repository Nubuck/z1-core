// parts
import { combine } from './combine'
import { createOrCompose } from './createOrCompose'

// main
export const box = ctx => {
  const CreateOrCompose = createOrCompose(ctx)
  const Combine = combine(ctx)
  return {
    create: CreateOrCompose,
    combine: Combine,
  }
}
