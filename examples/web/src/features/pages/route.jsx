import React from 'react'
import z from '@z1/lib-feature-box'
import mx from '@z1/lib-feature-macros'

//parts
import views from './views'

// main
export const route = ctx => {
  const Views = views.ui(ctx.ui)
  return z.ui.connect(
    { pages: 'state' },
    ctx.mutators
  )(props => mx.routeView.render(Views, props.state, props.mutations))
}

export const landingRoute = ctx => () => {
  const loading = true
  const disabled = false
  const size = 'md'
  return (
    <ctx.Page key="landing">
      <ctx.Box as="h1" box={{ fontSize: '2xl', fontWeight: 'medium' }}>
        Home
      </ctx.Box>
      <ctx.Box
        as={z.ui.Link}
        to="/pages"
        color={['yellow-500', { hover: 'green-500' }]}
      >
        pages
      </ctx.Box>
      <ctx.Row x="center" y="center">
        <ctx.MapIndexed
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
              // icon: 'gear',
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
              // icon: 'gear',
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
              // icon: 'gear',
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
              // icon: 'gear',
              label: 'button',
              size,
              color: 'purple-500',
              shape: 'circle',
              fill: 'ghost-solid',
            },
          ]}
          render={(btn, index) => (
            <ctx.Button key={index} box={{ margin: 2 }} {...btn} />
          )}
        />
      </ctx.Row>
      <ctx.Row x="center" y="center">
        <ctx.MapIndexed
          items={[
            {
              loading,
              disabled,
              // icon: 'gear',
              label: 'button',
              size: 'xs',
              // color: 'purple-500',
              fill: 'outline',
              src: 'https://avatars1.githubusercontent.com/u/6399322?s=460&v=4',
            },
            {
              loading,
              disabled,
              // icon: 'gear',
              label: 'button',
              size: 'sm',
              // color: 'purple-500',
              fill: 'outline',
              src: 'https://avatars1.githubusercontent.com/u/6399322?s=460&v=4',
            },
            {
              loading,
              disabled,
              // icon: 'gear',
              label: 'button',
              size: 'md',
              // color: 'purple-500',
              fill: 'outline',
              src: 'https://avatars1.githubusercontent.com/u/6399322?s=460&v=4',
            },
            {
              loading,
              disabled,
              // icon: 'gear',
              label: 'button',
              size: 'lg',
              // color: 'purple-500',
              fill: 'outline',
              src: 'https://avatars1.githubusercontent.com/u/6399322?s=460&v=4',
            },
            {
              loading,
              disabled,
              icon: 'gear',
              label: 'button',
              size: 'xl',
              // color: 'purple-500',
              fill: 'outline',
              src: 'https://avatars1.githubusercontent.com/u/6399322?s=460&v=4',
            },
          ]}
          render={(avatar, index) => (
            <ctx.Avatar key={index} box={{ margin: 2 }} {...avatar} />
          )}
        />
      </ctx.Row>
      <ctx.IconLabel
        icon={{ name: 'gear', size: '2xl' }}
        label={{ children: 'label', margin: { left: 2 } }}
      />
    </ctx.Page>
  )
}
export const notFoundRoute = ctx => () => (
  <ctx.VStack
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
    <ctx.Box as="h1" box={{ fontSize: 'lg', fontWeight: 'medium' }}>
      404 Not Found
    </ctx.Box>
    <ctx.Box
      as={z.ui.Link}
      to="/"
      color={['yellow-500', { hover: 'green-500' }]}
    >
      home
    </ctx.Box>
  </ctx.VStack>
)
