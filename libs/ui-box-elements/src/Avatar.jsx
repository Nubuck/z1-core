import React from 'react'
import { fn } from '@z1/lib-ui-box'

// elements
import { renderButton } from './Button'

// main
const baseProps = {
  as: 'div',
  shape: 'circle',
  fill: 'outline',
}
const circleSize = fn(t =>
  t.match({
    _: {
      width: '2.9rem',
      height: '2.9rem',
    },
    xs: {
      width: '2.3rem',
      height: '2.3rem',
    },
    sm: {
      width: '2.5rem',
      height: '2.5rem',
    },
    lg: {
      width: '3.25rem',
      height: '3.25rem',
    },
    xl: {
      width: '3.5rem',
      height: '3.5rem',
    },
  })
)
const renderAvatar = fn(t => props => {
  const src = t.atOr(null, 'src', props)
  const to = t.atOr(null, 'to', props)
  const onClick = t.atOr(null, 'onClick', props)
  const noLink = t.isNil(to)
  const noClick = t.isNil(onClick)
  const baseMode = t.and(noLink, noClick) ? 'inactive' : 'active'
  const mode = t.atOr(baseMode, 'mode', props)
  const nextProps = t.mergeAll([
    baseProps,
    t.omit(['src', 'style', 'to', 'onClick', 'mode'], props),
    { mode },
    noLink ? {} : { to },
    noClick ? {} : { onClick },
    t.isNil(src)
      ? {}
      : {
          bgSize: 'cover',
          style: t.mergeAll([
            { backgroundImage: `url("${src}")` },
            circleSize(props.size || 'md'),
            t.atOr({}, 'style', props),
          ]),
        },
  ])
  return renderButton(nextProps)
})

export class Avatar extends React.Component {
  render() {
    return renderAvatar(this.props)
  }
}
Avatar.displayName = 'Avatar'
