import React from 'react'
import mx from '@z1/lib-feature-macros'

// main
export const home = mx.routeView.create('home', {
  state(ctx) {
    return {
      initial: {
        data: {
          content: []
        }
      },
    }
  },
  ui(ctx) {
    return ({ state, mutations }) => {
      return (
        <div>
          <h1>home view</h1>
        </div>
      )
    }
  },
})
