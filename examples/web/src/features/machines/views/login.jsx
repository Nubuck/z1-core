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
        subscribe(props) {
          return ctx.macro.subscribe([
            {
              id: '_id',
              entity: 'login',
              service: props.api.service('machine-logins'),
              events: ['created', 'patched'],
              mutator: props.mutators.dataChange,
              filter: (login, event) =>
                t.and(
                  t.eq('patched', event),
                  t.eq(props.params.detail, t.at('_id', login))
                ),
            },
          ])
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
