import mx from '@z1/lib-feature-macros'
const { types } = mx.view

// main
export const modalx = mx.fn(t => props => {
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
      return t.isNil(t.at('next.error', props))
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
