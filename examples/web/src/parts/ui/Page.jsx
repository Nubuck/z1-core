import React from 'react'
import z from '@z1/lib-feature-box'
import { VStack, Match, Spinner, Col } from '@z1/lib-ui-box-elements'
import { isRenderProp } from './common'

// main
const renderPage = z.fn(t => props => {
  const loading = t.atOr(false, 'loading', props)
  const centered = t.atOr(false, 'centered', props)
  const shouldCenter = loading ? true : centered
  const box = t.atOr({}, 'box', props)
  const next = t.atOr({}, 'next', props)
  const pageProps = t.merge(
    {
      x: shouldCenter ? 'center' : 'left',
      y: shouldCenter ? 'center' : 'top',
      box: {
        padding: [{ x: 3, top: 3, bottom: 1 }, { lg: 4 }],
        position: 'relative',
        flex: 1,
        width: 'full',
        zIndex: 0,
        minHeight: 'full',
      },
      next: b => b.next(box).next(next),
    },
    t.omit(
      ['children', 'render', 'loading', 'centered', 'color', 'box', 'next'],
      props
    )
  )
  return (
    <VStack {...pageProps}>
      <Match
        value={loading ? 'loading' : 'ready'}
        render={{
          loading: () => (
            <Col x="center" y="center" flex={1}>
              <Spinner size="lg" color={t.atOr('white', 'color', props)} />
            </Col>
          ),
          ready: () => {
            return isRenderProp(props.render)
              ? props.render({ loading, centered })
              : props.children
          },
        }}
      />
    </VStack>
  )
})

export class Page extends React.Component {
  render() {
    return renderPage(this.props)
  }
}
Page.displayName = 'Page'
