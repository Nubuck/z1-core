import mx from '@z1/lib-feature-macros'

// main
export const transmitOk = mx.fn(t => props =>
  t.and(
    t.eq(props.event, mx.view.types.event.formTransmitComplete),
    t.isNil(t.at('next.error', props))
  )
)

export const sizes = {
  xs: 10,
  sm: 8,
  md: 5,
  lg: 4,
  xl: 3,
}
