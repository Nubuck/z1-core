import React from 'react'
import z from '@z1/lib-feature-box'
import { VStack } from '@z1/lib-ui-box-elements'
import { AutoSizer as Aszr } from 'react-virtualized/dist/es/AutoSizer'
import { List } from 'react-virtualized/dist/es/List'

// parts
const isRenderProp = z.fn((t) => (prop) =>
  t.isNil(prop) ? false : t.isType(prop, 'function')
)

// main
const renderVList = z.fn((t) => (props, onScroll, scrollTop, auto) => {
  const box = t.atOr({}, 'box', props)
  const items = t.atOr([], 'items', props)
  const render = t.atOr(null, 'render', props)
  const baseListProps = isRenderProp(render)
    ? {
        rowCount: t.len(items),
        rowRenderer: (rowProps) => {
          const item = items[rowProps.index]
          return render(item, t.merge(rowProps, { scrollTop }))
        },
        onScroll: auto ? undefined : ({ scrollTop }) => onScroll(scrollTop),
        scrollTop: auto ? undefined : scrollTop,
      }
    : {}
  const nextProps = t.omit(['box', 'items', 'render', 'scrollTop'], props)
  return (
    <VStack x="left" y="top" box={{ flex: 1, height: 'full' }} next={box}>
      <Aszr>
        {({ width, height }) => (
          <List
            width={width}
            height={height}
            className="scrollbar outline-none px-1"
            {...baseListProps}
            {...nextProps}
          />
        )}
      </Aszr>
    </VStack>
  )
})
const autoScroll = z.fn((t) => (ctx) => t.atOr(false, 'props.autoScroll', ctx))
const stateValue = z.fn((t) => (ctx) => t.atOr(0, 'state.scrollTop', ctx))
export class VList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scrollTop: props.scrollTop || 0,
    }
  }
  // UNSAFE_componentWillReceiveProps(nextProps) {
  //   console.log(typeof nextProps.scrollTop)
  //   if (this.props.scrollToIndex !== nextProps.scrollToIndex) {
  //     if (typeof nextProps.scrollToIndex === 'number') {
  //       this.setState({ scrollTop: nextProps.scrollToIndex })
  //     }
  //   }
  // }
  render() {
    const onScroll = (scrollTop) => this.setState({ scrollTop })
    return renderVList(this.props, onScroll, stateValue(this), autoScroll(this))
  }
}
VList.displayName = 'VList'
export const AutoSizer = Aszr
