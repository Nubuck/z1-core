import React from 'react'
import mx from '@z1/lib-feature-macros'
import sc from '@z1/lib-ui-schema'

// parts
const signInForm = props =>
  sc.form.create((f, k) =>
    f({ type: k.object }, [
      f('email', {
        title: 'Email Address',
        type: k.string,
        format: k.format.email,
        required: true,
        ui: {
          [k.ui.placeholder]: 'Your email address',
          [k.ui.disabled]: props.disabled,
        },
      }),
      f('password', {
        title: 'Password',
        type: k.string,
        required: true,
        ui: {
          [k.ui.widget]: k.widget.password,
          [k.ui.placeholder]: 'Your password',
          [k.ui.disabled]: props.disabled,
        },
      }),
    ])
  )

// main
export const signIn = mx.fn((t, a) =>
  mx.routeView.create('sign-in', {
    state() {
      return {
        initial: {
          data: {},
          form: {
            signIn: {
              data: {},
              form: signInForm({ disabled: false }),
            },
          },
        },
        data({ event, status, error, data, next }) {
          console.log('SIGN-IN VIEW DATA', event, next)
          return {
            status,
            data,
            error: t.pathOr(null, ['error'], next || {}),
          }
        },
        form({ event, status, data, form, next, error }) {
          return {
            signIn: {
              data: t.pathOr(form.signIn.data, ['data'], next || {}),
              form: signInForm({ disabled: t.eq(status, 'loading') }),
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
        }) {
          const [authErr, authResult] = await a.of(
            api.authenticate({
              strategy: 'local',
              email: form.signIn.data.email,
              password: form.signIn.data.password,
            })
          )
          console.log('SIGN IN TRANSMIT', authErr, authResult)
          if (authErr) {
            return {
              status,
              data: form.signIn.data,
              error: authErr,
            }
          }
          // get user success
          dispatch(mutators.authenticateSuccess({ user }))
          // NOTE: redirect back or to home
          const state = getState()
          if (state.account.redirectBackTo) {
            const redirectTo = state.account.redirectBackTo
            dispatch(mutators.redirectChange(null))
            dispatch(redirect(redirectTo))
            return {
              status,
              data: {},
              error: null,
            }
          }
          dispatch(
            redirect({
              type: 'landing/ROUTE_HOME',
              payload: {},
            })
          )
          return {
            status,
            data: {},
            error: null,
          }
        },
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
                    name: 'sign-in-alt',
                    size: '5xl',
                    color: 'yellow-500',
                  }}
                  label={{
                    text: 'Sign-in to your Account',
                    fontSize: '2xl',
                  }}
                  info={{
                    text: 'Enter your account credentials below to continue.',
                    fontSize: 'lg',
                    padding: { left: 1, top: 3 },
                  }}
                  flexDirection="col"
                  cols={{
                    left: { x: 'center' },
                    right: { x: 'center' },
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
                        text: 'Incorrect email or password',
                        fontSize: 'xl',
                        color: 'orange-500',
                      }}
                      next={b =>
                        b.next({
                          borderWidth: 2,
                          borderColor: 'orange-500',
                          padding: 3,
                          margin: { top: 5 },
                        })
                      }
                    />
                  )}
                />
                <ctx.Form
                  schema={props.state.form.signIn.form.schema}
                  uiSchema={props.state.form.signIn.form.uiSchema}
                  formData={props.state.form.signIn.data}
                  onSubmit={payload =>
                    props.mutations.formTransmit({ data: payload.formData })
                  }
                  xs={10}
                  sm={8}
                  md={5}
                  lg={4}
                  xl={3}
                  x="center"
                >
                  <ctx.HStack x="center" y="center">
                    <ctx.Button
                      type="submit"
                      size="lg"
                      shape="pill"
                      fill="outline"
                      colors={{ on: 'blue-500', off: 'yellow-500' }}
                      label="Continue"
                      loading={t.eq(props.state.data.status, 'loading')}
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
