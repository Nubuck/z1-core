import z from '@z1/lib-feature-box'

// main
export const ui = z.fn((t) => (cx) => (ctx) => {
  return t.reduce(
    (collection, part) => {
      const modal = t.at('modal', part)
      const nav = t.at('nav', part)
      const form = t.at('form', part)
      const rest = t.omit(['modal', 'nav', 'form'], part)
      return t.allOf([t.isNil(modal), t.isNil(nav), t.isNil(form)])
        ? t.merge(collection, rest)
        : t.mergeAll([
            collection,
            rest,
            t.isNil(modal)
              ? {}
              : {
                  modal: t.reduce(
                    (modalCollection, [key, modal]) => {
                      return {
                        buttons: t.has('buttons')(modal)
                          ? t.merge(modalCollection.buttons, {
                              [key]: modal.buttons,
                            })
                          : modalCollection.buttons,
                        slots: t.has('render')(modal)
                          ? t.merge(modalCollection.slots, {
                              [key]: modal.render,
                            })
                          : modalCollection.slots,
                        extra: t.has('props')(modal)
                          ? t.merge(modalCollection.extra, {
                              [key]: modal.props,
                            })
                          : modalCollection.extra,
                      }
                    },
                    collection.modal,
                    t.to.pairs(modal)
                  ),
                },
            t.isNil(nav)
              ? {}
              : {
                  nav: t.merge(collection.nav, nav),
                },
            t.isNil(form)
              ? {}
              : {
                  form: t.mergeDeepRight(collection.form, form),
                },
          ])
    },
    {
      modal: { buttons: {}, slots: {}, extra: {} },
      nav: {},
      form: {
        fields: {},
        widgets: {},
      },
    },
    t.map((part) => part.ui(ctx), cx)
  )
})
