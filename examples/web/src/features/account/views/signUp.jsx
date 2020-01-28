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
      const { types } = mx.routeView
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
                t.eq(props.event, types.event.formTransmitComplete),
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
              data: t.atOr(
                t.at('form.signUp.data', props),
                'data',
                props.next || {}
              ),
              ui: signUpForm({
                disabled: t.eq(props.status, types.status.loading),
              }),
            },
          }
        },
        async transmit(props) {
          const data =  t.at('form.signUp.data', props)
          const [checkError] = await a.of(
            props.api.service('auth-management').create({
              action: 'checkUnique',
              value: {
                email: data.email,
              },
            })
          )
          if (checkError) {
            return {
              status: types.status.fail,
              data,
              error: checkError,
            }
          }
          
          const [userError, userResult] = await a.of(
            props.api.service('users').create(
              t.mergeAll([
                data
                {
                  role: 'user',
                  status: 'offline',
                },
              ])
            )
          )
          if (userError) {
            return {
              status: types.status.fail,
              data,
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
            key="sign-up"
            centered
            render={() => (
              <ctx.Match
                value={t.at('state.data.mode', props)}
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
                          schema={t.at('state.form.signUp.ui.schema', props)}
                          uiSchema={t.at(
                            'state.form.signUp.ui.uiSchema',
                            props
                          )}
                          formData={t.at('state.form.signUp.data', props)}
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
                              loading={t.eq(
                                t.at('state.data.status', props),
                                'loading'
                              )}
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
