import mx from '@z1/lib-feature-macros'
const { types } = mx.view

// main
export const modalx = mx.fn((t) => (opts = { autoClose: true }, props) => {
  return t.runMatch({
    _: () => props.modal,
    [types.event.modalChange]: () => {
      const active = t.at('next.active', props)
      return t.merge(props.modal, {
        active,
        open: t.atOr(false, 'next.open', props),
        id: t.atOr(null, 'next.id', props),
        title: t.atOr({}, 'next.title', props),
        content: t.omit(
          ['active', 'id', 'open', 'title'],
          t.atOr({}, 'next', props)
        ),
      })
    },
    [types.event.formTransmitComplete]: () => {
      if (t.not(t.at('modal.open', props))) {
        return props.modal
      }
      const skipActive = t.atOr([], 'skipActive', opts)
      const active = t.at('modal.active', props)
      return t.allOf([
        t.isNil(t.at('next.error', props)),
        opts.autoClose,
        t.not(t.includes(active, skipActive)),
        t.neq(true, t.at('next.data.open', props)),
      ])
        ? t.merge(props.modal, {
            open: false,
            active: null,
            id: null,
            title: {},
            content: {},
          })
        : props.modal
    },
  })(props.event)
})
export default modalx
