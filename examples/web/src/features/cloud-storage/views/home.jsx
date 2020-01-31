// main
import React from 'react'
import mx from '@z1/lib-feature-macros'
import sc from '@z1/lib-ui-schema'

// main
export const home = mx.fn((t, a, rx) =>
  mx.view.create('home', {
    state(ctx) {
      return {
        initial: {
          data: {
            files: [],
          },
          form: {},
        },
        data(props) {
          return {
            status: props.status,
            data: props.data,
            error: props.error,
          }
        },
        async load(props) {
          return null
        },
      }
    },
    ui(ctx) {
      return props => {
        return (
          <ctx.Page
            key="cloud-storage"
            render={() => (
              <React.Fragment>
                <ctx.IconLabel
                  icon={{
                    name: 'cloud-upload-alt',
                    size: '3xl',
                    color: 'blue-500',
                  }}
                  label={{
                    fontWeight: 'bold',
                    text: 'Cloud Storage',
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
