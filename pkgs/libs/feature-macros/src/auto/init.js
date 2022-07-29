import z from '@z1/lib-feature-box'
import { types } from '../types'

// main
export const initx = z.fn((t) => (data = {}, forms = {}, modal = {}) => ({
  data,
  form: t.mapObjIndexed(
    (form) => ({
      entity: form.entity,
      entityAt: form.entityAt,
      dataAt: form.dataAt,
      data: {},
      ui: form.ui({ event: types.event.init, status: types.status.init }),
    }),
    forms
  ),
  modal: t.merge(
    {
      open: false,
      active: null,
      id: null,
      title: {},
      content: {},
    },
    modal
  ),
}))
export default initx
