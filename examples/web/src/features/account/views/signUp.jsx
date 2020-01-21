import React from 'react'
import z from '@z1/lib-feature-box'
import mx from '@z1/lib-feature-macros'

// main
export const signUp = mx.fn((t, a) =>
  mx.routeView.create('sign-up', {
    state() {
      return {
        initial: {
          data: {},
        },
        data({ event, status, error, data, next }) {
          console.log('SIGN-UP VIEW DATA', event, next)
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
            <h1>Sign-up view</h1>
            <div>
              <z.ui.Link to="/">Home</z.ui.Link>
            </div>
          </div>
        )
      }
    },
  })
)
