import React from 'react'
import mx from '@z1/lib-feature-macros'

// main
export const login = mx.fn((t, a) =>
  mx.view.create('login', {
    state(ctx) {
      return {
        initial: {
          data: {
            login: null,
            files: [],
          },
        },
        data(props) {
          return ctx.macro.data(props)
        },
        async load(props) {
          return await ctx.macro.load(
            [
              {
                entity: 'login',
                method: props.api
                  .service('machine-logins')
                  .get(props.params.detail),
              },
              {
                entity: 'files',
                method: props.api.service('bucket-registry').find({
                  query: {
                    includeAuthors: true,
                    createdBy: props.params.detail,
                    $sort: {
                      updatedAt: -1,
                    },
                    $limit: 10000,
                  },
                }),
                resultAt: 'data',
              },
            ],
            props
          )
        },
      }
    },
    ui(ctx) {
      return () => {
        return (
          <ctx.Page
            key="machine-profile"
            render={() => (
              <React.Fragment>
                <ctx.IconLabel
                  icon={{
                    name: 'user-astronaut',
                    size: '3xl',
                    color: 'blue-500',
                  }}
                  label={{
                    text: 'Machine Login Profile',
                    fontWeight: 'bold',
                    fontSize: 'xl',
                  }}
                  margin={{ bottom: 4 }}
                />
              </React.Fragment>
            )}
          />
        )
      }
    },
  })
)
