import React from 'react'
import z from '@z1/lib-feature-box'
import mx from '@z1/lib-feature-macros'

// main
export const about = z.fn((t, a) =>
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
        subscribe(context, box) {
          console.log('ABOUT SUB RUN', box.name, box.view)
          return null
        },
      }
    },
    ui(ctx) {
      return ({ state, mutations }) => {
        return (
          <div>
            <h1>About view</h1>
            <div>
              <z.ui.Link to="/pages">Home</z.ui.Link>
              <br />
              <z.ui.Link to="/pages/about/team">Team</z.ui.Link>
              <br />
              <z.ui.Link to="/pages/about/team/more">Team More</z.ui.Link>
              <br />
              <z.ui.Link to="/pages/about/detail">Detail</z.ui.Link>
              <br />
              <z.ui.Link to="/pages/about">Reload</z.ui.Link>
              <br />
              <z.ui.Link to="/about">Throw 404</z.ui.Link>
            </div>
          </div>
        )
      }
    },
  })
)
