import React from 'react'
import z from '@z1/lib-feature-box'
import mx from '@z1/lib-feature-macros'

// main
export const team = z.fn((t, a) =>
  mx.routeView.create(['about', 'team'], {
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
        subscribe(context, box) {
          console.log('TEAM SUB RUN', box.name, box.view)
          return null
        },
      }
    },
    ui(ctx) {
      return ({ state, mutations }) => {
        return (
          <div>
            <h1>Team view</h1>
            <div>
              <z.ui.Link to="/pages/about">Back</z.ui.Link>
              <br />
              <z.ui.Link to="/pages/about/team">Reload</z.ui.Link>
              <br />
              <z.ui.Link to="/derp">Throw 404</z.ui.Link>
            </div>
          </div>
        )
      }
    },
  })
)
