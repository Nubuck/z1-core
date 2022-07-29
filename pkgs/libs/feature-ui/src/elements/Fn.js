// TODO: meta element to render prop
import React from 'react'
import z from '@z1/lib-feature-box'

// main
export const Fn = z.fn((t) => (props) => {
  const render = t.at('render', props)
  if (t.isNil(render)) {
    return null
  }
  const nextProps = t.omit(['render', 'fn'], props)
  return render(t.merge(nextProps, { fn: t }))
})
