import React from 'react'
import zbx from '@z1/lib-feature-box'
import mx from '@z1/lib-feature-macros'

// main
export const about = zbx.fn((t, a) =>
  mx.routeView.create('about', {
    state(ctx) {
      return {
        initial: {
          data: {
            events: [],
          },
        },
        data({ event, status, error, data, next }) {
          console.log('ABOUT VIEW DATA', event, next)
          return {
            status,
            data: t.merge(data, {
              events: t.concat(data.events, [event]),
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
            <h1>About view</h1>
            <div>
              <zbx.ui.Link to="/pages">Home</zbx.ui.Link>
              <br />
              <zbx.ui.Link to="/pages/about">Reload</zbx.ui.Link>
              <br />
              <zbx.ui.Link to="/about">Throw 404</zbx.ui.Link>
            </div>
          </div>
        )
      }
    },
  })
)
