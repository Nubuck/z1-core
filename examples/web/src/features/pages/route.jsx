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

export const LandingRoute = () => (
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
      Home
    </el.Box>
    <el.Box
      as={z.ui.Link}
      to="/pages"
      color={['yellow-500', { hover: 'green-500' }]}
    >
      pages
    </el.Box>
    {/* <el.Spinner size="lg" /> */}
    <el.Match
      value="landisdng"
      render={{
        _() {
          console.log('NOT EVALUED')
          return <div>no match</div>
        },
        landing() {
          return <div>match</div>
        },
      }}
    />
    <el.When
      is={true}
      render={() => (
        <div>
          <el.Icon name="user" /> Safe when
        </div>
      )}
    />
    <el.MapIndexed
      items={['default', 'sm', 'md', 'lg', 'xl']}
      render={(size, index) => (
        <React.Fragment key={`item_${index}`}>
          {/* <el.Spinner size={size} color='yellow' /> */}
          <br />
        </React.Fragment>
      )}
    />
    <el.Button
      size="xs"
      fill="outline"
      shape="normal"
      icon="user"
      label="Button"
      colors="blue-500"
    />
    <br />
    <el.Button
      size="sm"
      fill="outline"
      shape="normal"
      icon="user"
      label="Button"
      colors={{ on: 'blue-500' }}
    />
    <br />
    <el.Button
      size="md"
      fill="outline"
      shape="normal"
      icon="user"
      label="Button"
      colors={{ off: 'blue-500', on: 'yellow-500' }}
    />
    <br />
    <el.Button
      size="lg"
      fill="outline"
      shape="normal"
      icon={{ name: 'user' }}
      label={{ text: 'Button' }}
      colors={{
        off: {
          border: 'blue-500',
          content: 'green-500',
        },
        on: { bg: 'blue-500', border: 'yellow-500', content: 'yellow-500' },
      }}
    />
    <br />
    <el.Button
      size="xl"
      fill="outline"
      shape="normal"
      icon="user"
      label="Button"
      color="pink-500"
    >
      derp
    </el.Button>
  </el.VStack>
)

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
