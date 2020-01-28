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
        data({ event, status, error, data, next }) {
          console.log('SIGN-UP VIEW DATA', event, next)
          return {
            status,
            data: t.merge(data, {
              mode: t.and(t.eq(event, 'form-transmit-complete'), t.isNil(error))
                ? 'view'
                : 'form',
            }),
            data,
            error: t.pathOr(null, ['error'], next || {}),
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
        }) {
          const [checkError] = await a.of(
            api.service('auth-management').create({
              action: 'checkUnique',
              value: {
                email: form.signUp.data.email,
              },
            })
          )
          if (checkError) {
            return {
              status,
              data: form.signUp.data,
              error: checkError,
            }
          }
          const [userError, userResult] = await a.of(
            api.service('users').create(
              t.mergeAll([
                form.signUp.data,
                {
                  role: 'user',
                  status: 'offline',
                },
              ])
            )
          )
          if (userError) {
            return {
              status,
              data: form.signUp.data,
              error: userError,
            }
          }
          return {
            status,
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
                            size: '3xl',
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
                            props.mutations.formTransmit({
                              data: payload.formData,
                            })
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
                            text: 'Thank you for registering a Novabot account',
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
                          colors={{ on: 'green-500', off: 'yellow-500' }}
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
