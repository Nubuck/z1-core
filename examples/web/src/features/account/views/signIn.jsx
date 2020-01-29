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
  mx.view.create('sign-in', {
    state() {
      return {
        initial: {
          data: {},
          form: {
            signIn: {
              data: {},
              ui: signInForm({ disabled: false }),
            },
          },
        },
        data(props) {
          return {
            status: props.status,
            data: props.data,
            error: t.atOr(null, 'error',  props.next || {}),
          }
        },
        form(props) {
          return {
            signIn: {
              data: t.atOr(
                t.at('form.signIn.data', props),
                'data',
                props.next || {}
              ),
              ui: signInForm({ disabled: t.eq(props.status, 'loading') }),
            },
          }
        },
        async transmit(props) {
          const [authErr, authResult] = await a.of(
            props.api.authenticate({
              strategy: 'local',
              email: t.at('form.signIn.data.email', props),
              password: t.at('form.signIn.data.password', props),
            })
          )
          if (authErr) {
            return {
              status: props.status,
              data: t.at('form.signIn.data', props),
              error: authErr,
            }
          }
          props.dispatch(
            props.mutators.authenticateComplete({
              authStatus: 'auth-success',
              user: authResult.user,
              error: null,
            })
          )
          const state = props.getState()
          if (t.notNil(state.account.redirectBackTo)) {
            const redirectTo = state.account.redirectBackTo
            props.dispatch(props.mutators.redirectChange(null))
            props.dispatch(props.redirect(redirectTo))
            return {
              status: props.status,
              data: {},
              error: null,
            }
          }
          props.dispatch(
            props.redirect({
              type: 'pages/ROUTING/ROUTE_LANDING',
            })
          )
          return {
            status: props.status,
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
            loading={t.neq('ready', t.at('state.status', props))}
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
                  slots={{
                    icon: { x: 'center' },
                    label: { x: 'center' },
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
                      borderWidth={2}
                      borderColor="orange-500"
                      padding={3}
                      margin={{ top: 5 }}
                    />
                  )}
                />
                <ctx.Form
                  schema={t.at('state.form.signIn.ui.schema', props)}
                  uiSchema={t.at('state.form.signIn.form.uiSchema', props)}
                  formData={t.at('state.form.signIn.data', props)}
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
                  <ctx.Row x="center" y="center">
                    <ctx.Button
                      type="submit"
                      size="lg"
                      shape="pill"
                      fill="outline"
                      colors={{ on: 'blue-500', off: 'yellow-500' }}
                      label="Continue"
                      loading={t.eq(
                        t.at('state.data.status', props),
                        'loading'
                      )}
                    />
                  </ctx.Row>
                </ctx.Form>
              </React.Fragment>
            )}
          />
        )
      }
    },
  })
)
