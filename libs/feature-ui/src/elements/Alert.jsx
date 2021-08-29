import React from 'react'
import z from '@z1/lib-feature-box'
import { Row } from '@z1/lib-ui-box-elements'
import { renderIconLabel } from './IconLabel'

// // main
const renderAlert = z.fn((t) => (props) => {
  const icon = t.at('icon', props)
  const label = t.at('label', props)
  const msg = t.at('message', props)
  const baseLabel = {
    fontSize: 'sm',
    whitespace: 'normal',
    wordBreak: 'all',
    width: 'full',
    display: 'flex',
    maxWidth: 'full',
  }
  return renderIconLabel(
    t.mergeDeepRight(
      {
        slots: {
          icon: { alignSelf: 'auto', flex: 'none', padding: { right: 2 } },
          label: {
            flex: 1,
            maxWidth: 'full',
          },
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
          ? t.merge(baseLabel, {
              text: label,
            })
          : t.isType(msg, 'string')
          ? t.merge(baseLabel, {
              text: msg,
            })
          : t.notNil(label)
          ? t.merge(baseLabel, label)
          : label,
        borderWidth: 1,
        borderColor: t.at('color', props),
        padding: { x: 2, y: 3 },
        alignSelf: 'auto',
        borderRadius: 'sm',
        x: 'center',
        maxWidth: 'full',
        display: 'flex',
        flexWrap: true,
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
