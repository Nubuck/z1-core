# Z1 Lib Feature Box

The Z1 standard feature development solution for web apps. Feature-box extends [state-box](https://github.com/SaucecodeOfficial/zero-one-core/tree/master/libs/state-box) with [Redux-first-router](https://github.com/faceyspacey/redux-first-router) and includes macro functions for composable apps for managed state and ui with [React-redux](https://github.com/reduxjs/react-redux)

## Install

```
yarn add @z1/lib-feature-box react redux react-redux
```

## Usage

### /features/landing/state.js

```JavaScript

import { task, createStateBox } from '@z1/lib-feature-box'

export const landingState = task((t, a) =>
  createStateBox({
    name: 'landing',
    initial: {},
    mutations(m) {
      return [
        m(['routeHome', 'routeView'], (state, action) => {
          return state
        }),
      ]
    },
    routes(r, a) {
      return [
        r(a.routeHome, '/', { authenticate: false }),
        r(a.routeView, '/pages/:view', { authenticate: false }),
      ]
    },
    effects(fx, box) {
      return [
        fx(
          [box.actions.routeHome],
          async ({ getState, redirect }, dispatch, done) => {
            const accountStatus = t.pathOr(
              null,
              ['account', 'status'],
              getState()
            )
            if (t.eq(accountStatus, 'auth-success')) {
              dispatch(
                redirect({
                  type: 'serviceCmd/ROUTE_HOME',
                  payload: {
                    view: 'home',
                  },
                })
              )
            }
            done()
          }
        ),
      ]
    },
  })
)

```

### /features/landing/ui.jsx

```JavaScript

import React from 'react'
import { connectState, Link } from '@z1/lib-feature-box'

const stateQuery = ({ brand, landing }) => ({ brand })

export const LandingPage = ({ ui: { Box, VStack, Text } }) =>
  connectState(stateQuery)(({ brand, landing }) => {
    const linkBox = {
      color: ['green-400', { hover: 'white' }],
      fontWeight: 'semibold',
    }
    return (
      <VStack
        x="center"
        y="center"
        box={{ color: brand.secondary, height: 'full' }}
      >
        <Text
          size={['4xl', { md: '5xl' }]}
          family={brand.fontFamily}
          space="no-wrap"
          box={{ padding: { bottom: 2 } }}
        >
          Z1 App Starter
        </Text>
        <Text size="6xl" family={brand.fontFamily} x="center">
          Welcome
        </Text>
        <Text size="lg" family={brand.fontFamily} x="center">
          <Box as={Link} to={'/account/sign-up'} box={linkBox}>
            Sign-up
          </Box>
          <span> or </span>
          <Box as={Link} to={'/account/sign-in'} box={linkBox}>
            Sign-in
          </Box>
          <span> to get started</span>
        </Text>
      </VStack>
    )
  })

```

### /eatures/landing/main.js

```JavaScript

import { createFeature } from '@z1/lib-feature-box'

// state
import { landingState } from './state'

// ui
import { LandingPage } from './ui'

// exports
export const landing = createFeature(({ ui }) => {
  return {
    name: 'landing',
    state: [landingState],
    routes: [
      {
        type: [landingState.actions.routeHome, landingState.actions.routeView],
        ui: LandingPage({ ui }),
      },
    ],
  }
})

```

### /features/index.js

```JavaScript

import { combineFeatures } from '@z1/lib-feature-box'

// ui
import * as elements from '@z1/lib-ui-box-elements'

// features
import accountFeature from './account'
import layoutFeature from './layout'
import landingFeature from './landing'

// main
export default combineFeatures([
  layoutFeature({
    ui: { ...elements },
    brand: { title: 'Z1 App' },
}),
  accountFeature({ ui: { ...elements } }),
  landingFeature({ ui: { ...elements } }),
])

```

### /App.jsx

```JavaScript

import React from 'react'
import { renderRoute } from '@z1/lib-feature-box'

// hot
import features from './features'
const { Screen } = features.ui.layout

// main
const App = ({ routes }) => {
  return <Screen>{({ type }) => renderRoute(type, routes)}</Screen>
}

export default App

```

### /index.jsx

```JavaScript

// globals
import './app.css'
// packages
import React from 'react'
import { render } from 'react-dom'
import { createStateStore, reloadStateStore } from '@z1/lib-feature-box'
import { Provider } from 'react-redux'
import { createApiClient } from '@z1/lib-api-box-client'
// hot code
import App from './App'
import features from './features'
// api
const api = createApiClient({
  path: process.env.NODE_ENV === 'development' ? 'http://localhost:3035' : '/',
})
// state
const store = createStateStore({
  boxes: features.state,
  context: {
    api,
  },
})
// ui
const load = () => {
  render(
    <Provider store={store}>
      <App routes={features.routes} />
    </Provider>,
    document.getElementById('root')
  )
}
// reload
if (module.hot) {
  module.hot.accept(['./App', './features'], () => {
    reloadStateStore(store, features.state)
    load()
  })
}
// run
load()

```
