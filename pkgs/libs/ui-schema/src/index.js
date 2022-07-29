import form, { keys } from './form'
import nav, { findNavItem as find } from './nav'

export const formSchema = form
export const findNavItem = find
export const navSchema = nav
const uix = { form: { create: form, keys }, nav: { create: nav, find } }
export default uix
