import React from 'react'
import z from '@z1/lib-feature-box'
import { Row } from '@z1/lib-ui-box-elements'
import { renderIconLabel } from './IconLabel'

// // main
const renderAlert = z.fn(t => props => {
  return renderIconLabel(
    t.mergeDeepRight(
      {
        icon: {
          name: t.at('icon', props),
          size: '3xl',
        },
        label: {
          text: t.at('message', props),
          fontSize: 'xl',
        },
        borderWidth: 2,
        borderColor: t.at('color', props),
        padding: { x: 3, y: 4 },
        alignSelf: 'auto',
      },
      t.omit(['message'], props)
    )
  )
})

export class Alert extends React.Component {
  render() {
    return renderAlert(this.props)
  }
}
Alert.displayName = 'Alert'
