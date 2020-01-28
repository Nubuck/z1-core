import React from 'react'
import mx from '@z1/lib-feature-macros'
import sc from '@z1/lib-ui-schema'

// parts
const signUpForm = props =>
  sc.form.create((f, k) =>
    f({ type: k.object }, [
      f('name', {
        title: 'First name',
        type: k.string,
        required: true,
        ui: {
          [k.ui.placeholder]: 'Your first name',
          [k.ui.disabled]: props.disabled,
        },
      }),
      f('surname', {
        title: 'Surname',
        type: k.string,
        required: true,
        ui: {
          [k.ui.placeholder]: 'Your surname',
          [k.ui.disabled]: props.disabled,
        },
      }),
      f('email', {
        title: 'Email address',
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
export const signUp = mx.fn((t, a) =>
  mx.routeView.create('sign-up', {
    state() {
      return {
        initial: {
          data: {
            mode: 'form',
          },
          form: {
            signUp: {
              data: {},
              form: signUpForm({ disabled: false }),
            },
          },
        },
        data(props) {
          console.log('SIGN-UP VIEW DATA', props)
          return {
            status: props.status,
            data: t.merge(props.data, {
              mode: t.and(
                t.eq(
                  props.event,
                  mx.routeView.types.event.formTransmitComplete
                ),
                t.isNil(props.error)
              )
                ? 'view'
                : 'form',
            }),
            data: props.data,
            error: t.atOr(null, 'error', props.next || {}),
          }
        },
        form(props) {
          return {
            signUp: {
              data: t.atOr(props.form.signUp.data, 'data', props.next || {}),
              ui: signUpForm({
                disabled: t.eq(props.status, mx.routeView.types.status.loading),
              }),
            },
          }
        },
        async transmit(props) {
          const [checkError] = await a.of(
            props.api.service('auth-management').create({
              action: 'checkUnique',
              value: {
                email: props.form.signUp.data.email,
              },
            })
          )
          if (checkError) {
            return {
              status: mx.routeView.types.status.fail,
              data: props.form.signUp.data,
              error: checkError,
            }
          }
          const [userError, userResult] = await a.of(
            props.api.service('users').create(
              t.mergeAll([
                props.form.signUp.data,
                {
                  role: 'user',
                  status: 'offline',
                },
              ])
            )
          )
          if (userError) {
            return {
              status: mx.routeView.types.status.fail,
              data: props.form.signUp.data,
              error: userError,
            }
          }
          return {
            status: props.status,
            data: userResult,
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
              <ctx.Match
                value={props.state.data.mode}
                render={{
                  form() {
                    return (
                      <React.Fragment>
                        <ctx.IconLabel
                          icon={{
                            name: 'user-plus',
                            size: '5xl',
                            color: 'yellow-500',
                          }}
                          label={{
                            text: 'Sign-up for an Account',
                            fontSize: '2xl',
                          }}
                          info={{
                            text:
                              'Enter your account credentials below to continue.',
                            fontSize: 'lg',
                            padding: { left: 1, y: 3 },
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
                                text: props.state.error.message,
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
                          schema={props.state.form.signUp.ui.schema}
                          uiSchema={props.state.form.signUp.ui.uiSchema}
                          formData={props.state.form.signUp.data}
                          onSubmit={payload =>
                            props.mutations.formTransmit({
                              data: payload.formData,
                            })
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
                    )
                  },
                  view() {
                    return (
                      <React.Fragment>
                        <ctx.IconLabel
                          icon={{
                            name: 'check-circle',
                            size: '5xl',
                            color: 'yellow-500',
                          }}
                          label={{
                            text: 'Sign-up Successful',
                            fontSize: '4xl',
                          }}
                          info={{
                            text: 'Thank you for registering an Account',
                            fontSize: '2xl',
                            padding: { left: 1, y: 4 },
                          }}
                        />
                        <ctx.Button
                          as={ctx.Link}
                          to="/account/sign-in"
                          icon="sign-in-alt"
                          type="submit"
                          size="lg"
                          shape="pill"
                          fill="outline"
                          colors={{ on: 'blue-500', off: 'yellow-500' }}
                          label="Continue to Sign-in"
                          margin={{ top: 2 }}
                        />
                      </React.Fragment>
                    )
                  },
                }}
              />
            )}
          />
        )
      }
    },
  })
)
