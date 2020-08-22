import mx from '@z1/lib-feature-macros'
const { types } = mx.view

// main
export const initx = mx.fn(t => (data = {}, forms = {}, modal = {}) => ({
  data,
  form: t.mapObjIndexed(
    form => ({
      entity: form.entity,
      entityAt: form.entityAt,
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