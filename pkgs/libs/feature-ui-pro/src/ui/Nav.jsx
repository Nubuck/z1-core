import React from 'react'
import z from '@z1/lib-feature-box'
import { Col, Button } from '@z1/lib-ui-box-elements'

// main
const buttonColors = (selected) => {
  return {
    off: {
      bg: null,
      content: 'white',
      border: 'transparent',
    },
    on: selected
      ? {
          bg: 'gray-900',
          content: 'yellow-500',
          border: 'transparent',
        }
      : {
          bg: 'gray-700',
          content: 'blue-500',
          border: 'transparent',
        },
  }
}
const buttonProps = (selected) => {
  return {
    fill: 'solid',
    shape: 'square',
    size: 'sm',
    colors: buttonColors(selected),
    selected,
    padding: {
      bottom: 2,
      top: 2,
    },
  }
}
export const Nav = z.fn((t) => (props) => {
  const active = t.atOr('flow', 'view.active', props)
  const setView = (view) =>
    props.setView(t.merge(t.atOr({}, 'view', props), { active: view }))
  return (
    <Col
      x="center"
      y="top"
      position="fixed"
      pin={{ left: true, top: true, bottom: true }}
      bgColor="gray-800"
    >
      <Button
        {...buttonProps(t.eq('flow', active))}
        icon={{ name: 'project-diagram' }}
        onClick={() => {
          setView('flow')
        }}
      />
      <Button
        {...buttonProps(t.eq('fs', active))}
        icon={{ name: 'file-alt' }}
        onClick={() => {
          setView('fs')
        }}
      />

      <Button
        {...buttonProps(t.eq('dataTypes', active))}
        icon={{ name: 'th-list' }}
        onClick={() => {
          setView('dataTypes')
        }}
      />
      <Button
        {...buttonProps(t.eq('builder', active))}
        icon={{ name: 'code' }}
        onClick={() => {
          setView('builder')
        }}
      />
    </Col>
  )
})
