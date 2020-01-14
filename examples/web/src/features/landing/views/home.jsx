import React from 'react'
import z from '@z1/lib-feature-box'
import mx from '@z1/lib-feature-macros'

// main
export const home = mx.fn((t, a) =>
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
        subscribe(context, box) {
          console.log('HOME SUB RUN', box.name, box.view)
          return null
        },
      }
    },
    ui(ctx) {
      return ({ state, mutations }) => {
        return (
          <div>
            <h1>Home view</h1>
            <div>
              <z.ui.Link to="/pages/about">About</z.ui.Link>
              <br />
              <z.ui.Link to="/">Home</z.ui.Link>
            </div>
          </div>
        )
      }
    },
  })
)
