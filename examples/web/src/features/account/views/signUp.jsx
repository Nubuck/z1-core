import React from 'react'
import mx from '@z1/lib-feature-macros'
import sc from '@z1/lib-ui-schema'

// parts
const signUpForm = props => sc.form.create((f, k) => f({ type: k.object }, []))

// main
export const signUp = mx.fn((t, a) =>
  mx.routeView.create('sign-up', {
    state() {
      return {
        initial: {
          data: {},
          form: {
            signUp: {
              data: {},
              form: signUpForm({ disabled: false }),
            },
          },
        },
        data({ event, status, error, data, next }) {
          console.log('SIGN-UP VIEW DATA', event, next)
          return {
            status,
            data,
            error,
          }
        },
        form({ event, status, data, form, next, error }) {
          return {
            signUp: {
              data: t.pathOr(form.signUp.data, ['data'], next || {}),
              form: signUpForm({ disabled: t.eq(status, 'loading') }),
            },
          }
        },
        async transmit({
          status,
          form,
          api,
          dispatch,
          getState,
          mutators,
          redirect,
        }) {}
      }
    },
    ui(ctx) {
      return props => {
        return (
          <ctx.Page
            key="sign-in"
            centered
            render={() => (
              <React.Fragment>
                <ctx.IconLabel
                  icon={{
                    name: 'user-plus',
                    size: '3xl',
                    color: 'yellow-500',
                  }}
                  label={{
                    text: 'Sign-up for an Account',
                    fontSize: '2xl',
                  }}
                  info={{
                    text: 'Enter your account credentials below to continue.',
                    fontSize: 'lg',
                    padding: { left: 1, top: 3 },
                  }}
                />
                <ctx.When
                  is={t.notNil(props.state.error)}
                  render={() => (
                    <ctx.IconLabel
                      icon={{
                        name: 'exclamation-triangle',
                        size: '2xl',
                        color: 'orange-500',
                      }}
                      label={{
                        text: props.state.error.message,
                        fontSize: 'xl',
                        color: 'orange-500',
                      }}
                      next={b =>
                        b.next({
                          borderWidth: 2,
                          borderColor: 'orange-500',
                          padding: 3,
                          margin: { top: 4 },
                        })
                      }
                    />
                  )}
                />
                <ctx.Form
                  schema={props.state.form.signUp.form.schema}
                  uiSchema={props.state.form.signUp.form.uiSchema}
                  formData={props.state.form.signUp.data}
                  onSubmit={payload =>
                    props.mutations.formTransmit({ data: payload.formData })
                  }
                  xs={10}
                  sm={8}
                  md={5}
                  lg={4}
                  x="center"
                >
                  <ctx.HStack x="center" y="center">
                    <ctx.Button
                      type="submit"
                      size="lg"
                      shape="pill"
                      fill="outline"
                      colors={{ on: 'green-500', off: 'yellow-500' }}
                      label="Submit"
                    />
                  </ctx.HStack>
                </ctx.Form>
              </React.Fragment>
            )}
          />
        )
      }
    },
  })
)
