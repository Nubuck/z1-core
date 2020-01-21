import React from 'react'
import z from '@z1/lib-feature-box'
import mx from '@z1/lib-feature-macros'

// main
export const notAuthorized = mx.fn((t, a) =>
  mx.routeView.create('not-authorized', {
    state(ctx) {
      return {
        initial: {
          data: {},
        },
        data({ event, status, error, data, next }) {
          console.log('UNAUTHORIZED VIEW DATA', event, next)
          return {
            status,
            data,
            error,
          }
        },
      }
    },
    ui(ctx) {
      return ({ state, mutations }) => {
        return (
          <div>
            <h1>Unauthorized view</h1>
            <div>
              <z.ui.Link to="/">Home</z.ui.Link>
            </div>
          </div>
        )
      }
    },
  })
)
