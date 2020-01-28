import React from 'react'
import z from '@z1/lib-feature-box'
import { VStack, Match, Spinner } from '@z1/lib-ui-box-elements'
import { isRenderProp } from './common'

// main
const renderPage = z.fn(t => props => {
  const loading = t.pathOr(false, ['loading'], props)
  const centered = t.pathOr(false, ['centered'], props)
  const shouldCenter = loading ? true : centered
  const box = t.pathOr({}, ['box'], props)
  const next = t.pathOr({}, ['next'], props)
  const pageProps = t.merge(
    {
      x: shouldCenter ? 'center' : 'left',
      y: shouldCenter ? 'center' : 'top',
      box: {
        padding: 3,
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
            <Spinner size="lg" color={t.pathOr('white', ['color'], props)} />
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
