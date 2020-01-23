import React from 'react'
import z from '@z1/lib-feature-box'
import mx from '@z1/lib-feature-macros'
import el from '@z1/lib-ui-box-elements'

//parts
import views from './views'

// main
export const route = ctx => {
  const Views = views.ui(ctx.ui)
  return z.ui.connect(
    z.ui.query([{ pages: 'state' }]),
    ctx.mutators
  )(props => mx.routeView.render(Views, props.state, props.mutations))
}

export const LandingRoute = () => {
  const loading = false
  const disabled = false
  const size = 'sm'
  return (
    <el.VStack
      as="section"
      x="center"
      y="center"
      box={{
        position: 'relative',
        flex: 1,
        width: 'full',
        minHeight: 'screen',
        overflowY: 'auto',
        overflowX: 'hidden',
        zIndex: 0,
      }}
    >
      <el.Box as="h1" box={{ fontSize: '2xl', fontWeight: 'medium' }}>
        Home
      </el.Box>
      <el.Box
        as={z.ui.Link}
        to="/pages"
        color={['yellow-500', { hover: 'green-500' }]}
      >
        pages
      </el.Box>
      <el.Row x="center" y="center">
        <el.MapIndexed
          items={[
            {
              loading,
              disabled,
              icon: 'gear',
              label: 'button',
              size,
              color: 'pink-500',
              fill: 'outline',
            },
            {
              loading,
              disabled,
              icon: 'gear',
              label: 'button',
              size,
              color: 'pink-500',
              shape: 'square',
              fill: 'outline',
            },
            {
              loading,
              disabled,
              icon: 'gear',
              label: 'button',
              size,
              color: 'pink-500',
              shape: 'pill',
              fill: 'outline',
            },
            {
              loading,
              disabled,
              icon: 'gear',
              label: 'button',
              size,
              color: 'pink-500',
              shape: 'circle',
              fill: 'outline',
            },
            {
              loading,
              disabled,
              icon: 'gear',
              label: 'button',
              size,
              color: 'teal-500',
              fill: 'ghost-outline',
            },
            {
              loading,
              disabled,
              icon: 'gear',
              label: 'button',
              size,
              color: 'teal-500',
              shape: 'square',
              fill: 'ghost-outline',
            },
            {
              loading,
              disabled,
              icon: 'gear',
              label: 'button',
              size,
              color: 'teal-500',
              shape: 'pill',
              fill: 'ghost-outline',
            },
            {
              loading,
              disabled,
              icon: 'gear',
              label: 'button',
              size,
              color: 'teal-500',
              shape: 'circle',
              fill: 'ghost-outline',
            },
            {
              loading,
              disabled,
              icon: 'gear',
              label: 'button',
              size,
              colors: { off: 'blue-500', on: 'blue-600' },
              fill: 'solid',
            },
            {
              loading,
              disabled,
              icon: 'gear',
              label: 'button',
              size,
              colors: { off: 'blue-500', on: 'blue-600' },
              shape: 'square',
              fill: 'solid',
            },
            {
              loading,
              disabled,
              icon: 'gear',
              label: 'button',
              size,
              colors: { off: 'blue-500', on: 'blue-600' },
              shape: 'pill',
              fill: 'solid',
            },
            {
              loading,
              disabled,
              icon: 'gear',
              label: 'button',
              size,
              colors: { off: 'blue-500', on: 'blue-600' },
              shape: 'circle',
              fill: 'solid',
            },

            {
              loading,
              disabled,
              icon: 'gear',
              label: 'button',
              size,
              color: 'purple-500',
              fill: 'ghost-solid',
            },
            {
              loading,
              disabled,
              icon: 'gear',
              label: 'button',
              size,
              color: 'purple-500',
              shape: 'square',
              fill: 'ghost-solid',
            },
            {
              loading,
              disabled,
              icon: 'gear',
              label: 'button',
              size,
              color: 'purple-500',
              shape: 'pill',
              fill: 'ghost-solid',
            },
            {
              loading,
              disabled,
              icon: 'gear',
              label: 'button',
              size,
              color: 'purple-500',
              shape: 'circle',
              fill: 'ghost-solid',
            },
          ]}
          render={(btn, index) => (
            <el.Button key={index} box={{ margin: 2 }} {...btn} />
          )}
        />
      </el.Row>
    </el.VStack>
  )
}
export const NotFoundRoute = () => (
  <el.VStack
    as="section"
    x="center"
    y="center"
    box={{
      position: 'relative',
      flex: 1,
      width: 'full',
      minHeight: 'screen',
      overflowY: 'auto',
      overflowX: 'hidden',
      zIndex: 0,
    }}
  >
    <el.Box as="h1" box={{ fontSize: 'lg', fontWeight: 'medium' }}>
      404 Not Found
    </el.Box>
    <el.Box
      as={z.ui.Link}
      to="/"
      color={['yellow-500', { hover: 'green-500' }]}
    >
      home
    </el.Box>
  </el.VStack>
)
