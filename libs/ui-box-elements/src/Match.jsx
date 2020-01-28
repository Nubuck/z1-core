import React from 'react'
import { fn } from '@z1/lib-ui-box'

// main
const renderMatch = fn(t => props => {
  const when = t.atOr(null, 'when', props)
  const render = t.atOr(null, 'render', props)
  const matcher = t.and(t.isNil(when), t.isNil(render))
    ? null
    : t.isNil(when)
    ? 'render'
    : 'when'
  if (t.isNil(matcher)) {
    return null
  }
  const value = t.atOr('null', 'value', props)
  const matched = t.match(t.eq(matcher, 'render') ? render : when)(value)
  if (t.isNil(matched)) {
    return null
  }
  const nextProps = t.omit(['value', 'when', 'render'], props)
  return t.eq(matcher, 'render')
    ? matched(nextProps)
    : React.createElement(matched, nextProps)
})

export class Match extends React.Component {
  render() {
    return renderMatch(this.props)
  }
}
Match.displayName = 'Match'