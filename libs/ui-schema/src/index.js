import form from './form'
import nav, { findNavItem as find } from './nav'

export const formSchema = form
export const findNavItem = find
export const navSchema = nav
const uix = { form: { create: form }, nav: { create: nav, find } }
export default uix
