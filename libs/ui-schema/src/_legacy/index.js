import { formSchema } from './form'
import { navSchema, matchedNavItem } from './nav'

export * from './form'
export * from './nav'
export * from './view'
export * from './types'
const schema = {
  form: { create: formSchema },
  nav: { create: navSchema, match: matchedNavItem },
}
export default schema
