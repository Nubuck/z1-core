import React from 'react'
import zbx from '@z1/lib-feature-box'
import mx from '@z1/lib-feature-macros'

// main
export const home = zbx.fn((t, a) =>
  mx.routeView.create('home', {
    state(ctx) {
      return {
        initial: {
          data: {
            content: [],
          },
        },
        data({ event, status, error, data, next }) {
          console.log('HOME VIEW DATA', event, next)
          return {
            status,
            data: t.merge(data, {
              content: t.concat(data.content, [event]),
            }),
            error,
          }
        },
      }
    },
    ui(ctx) {
      return ({ state, mutations }) => {
        return (
          <div>
            <h1>Home view</h1>
            <div>
              <zbx.ui.Link to="/pages/about">About</zbx.ui.Link>
            </div>
          </div>
        )
      }
    },
  })
)
