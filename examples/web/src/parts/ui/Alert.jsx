import React from 'react'
import z from '@z1/lib-feature-box'
import { Row } from '@z1/lib-ui-box-elements'
import { renderIconLabel } from './IconLabel'

// // main
const renderAlert = z.fn(t => props => {
  const icon = t.at('icon', props)
  const label = t.at('label', props)
  const msg = t.at('message', props)
  return renderIconLabel(
    t.mergeDeepRight(
      {
        slots: {
          icon: { alignSelf: 'auto', flex: 'none', padding: { right: 2 } },
        },
        icon: t.isType(icon, 'string')
          ? {
              name: icon,
              size: '3xl',
            }
          : t.notNil(icon)
          ? t.merge({ size: '3xl' }, icon)
          : icon,
        label: t.isType(label, 'string')
          ? {
              text: label,
              fontSize: 'lg',
            }
          : t.isType(msg, 'string')
          ? {
              text: msg,
              fontSize: 'lg',
            }
          : t.notNil(label)
          ? t.merge({ fontSize: 'lg' }, label)
          : label,
        borderWidth: 1,
        borderColor: t.at('color', props),
        padding: { x: 3, y: 4 },
        alignSelf: 'auto',
        borderRadius: 'sm',
      },
      t.omit(['message', 'icon', 'label'], props)
    )
  )
})

export class Alert extends React.Component {
  render() {
    return renderAlert(this.props)
  }
}
Alert.displayName = 'Alert'
