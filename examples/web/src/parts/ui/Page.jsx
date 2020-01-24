import React from 'react'
import z from '@z1/lib-feature-box'
import { VStack, Match, Spinner } from '@z1/lib-ui-box-elements'

// main
const renderPage = z.fn(t => props => {
  const loading = t.pathOr(false, ['loading'], props)
  const center = t.pathOr(false, ['center'], props)
  const shouldCenter = loading ? true : center
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
        minHeight: 'screen',
        overflowY: 'auto',
        overflowX: 'hidden',
        zIndex: 0,
      },
      next: b => b.next(box).next(next),
    },
    t.omit(['children', 'loading', 'center', 'color', 'box', 'next'], props)
  )
  return (
    <VStack {...pageProps}>
      <Match
        value={loading ? 'loading' : 'ready'}
        render={{
          loading: () => (
            <Spinner size="lg" color={t.pathOr('white', ['center'], props)} />
          ),
          ready: () => props.children,
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
