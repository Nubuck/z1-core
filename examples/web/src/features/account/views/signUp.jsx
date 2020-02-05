import React from 'react'
import mx from '@z1/lib-feature-macros'
import sc from '@z1/lib-ui-schema'
import * as cm from './common'

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
  mx.view.create('sign-up', {
    state(ctx) {
      return {
        initial: {
          data: {
            mode: 'form',
          },
          form: {
            data: {},
            form: signUpForm({ disabled: false }),
          },
        },
        data(props) {
          return {
            status: props.status,
            error: t.atOr(null, 'next.error', props),
            data: t.merge(props.data, {
              mode: cm.transmitOk(props) ? 'view' : 'form',
            }),
          }
        },
        form(props) {
          return {
            data: cm.transmitOk(props)
              ? {}
              : t.merge(
                  t.at('form.data', props),
                  t.atOr({}, 'next.data', props)
                ),
            ui: signUpForm({
              disabled: t.eq(props.status, ctx.status.loading),
            }),
          }
        },
        async transmit(props) {
          const data = t.at('form.data', props)
          const [checkError, checkResult] = await a.of(
            props.api.service('auth-management').create({
              action: 'checkUnique',
              value: {
                email: data.email,
              },
            })
          )
          if (checkError) {
            return {
              status: ctx.status.fail,
              error: checkError,
              data,
            }
          }
          const [userError, userResult] = await a.of(
            props.api.service('users').create(
              t.mergeAll([
                data,
                {
                  role: 'user',
                  status: 'offline',
                },
              ])
            )
          )
          if (userError) {
            return {
              status: ctx.status.fail,
              error: userError,
              data,
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
        const status = t.at('state.status', props)
        return (
          <ctx.Page
            key="sign-up"
            centered
            loading={t.eq(status, ctx.status.waiting)}
            render={() => (
              <ctx.Match
                value={t.at('state.data.mode', props)}
                render={{
                  form() {
                    return (
                      <React.Fragment>
                        <ctx.IconLabel
                          slots={{
                            icon: { x: 'center' },
                            label: { x: 'center' },
                          }}
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
                        />
                        <ctx.When
                          is={t.notNil(props.state.error)}
                          render={() => (
                            <ctx.Alert
                              icon="exclamation-triangle"
                              message={t.atOr(
                                'Sign-up failed',
                                'state.error.message',
                                props
                              )}
                              color="orange-500"
                              margin={{ top: 5 }}
                              x="center"
                              {...cm.sizes}
                            />
                          )}
                        />
                        <ctx.Form
                          schema={t.at('state.form.ui.schema', props)}
                          uiSchema={t.at('state.form.ui.uiSchema', props)}
                          formData={t.at('state.form.data', props)}
                          onSubmit={payload =>
                            props.mutations.formTransmit({
                              data: payload.formData,
                            })
                          }
                          x="center"
                          {...cm.sizes}
                        >
                          <ctx.Row x="center" y="center" margin={{ top: 3 }}>
                            <ctx.Button
                              reverse
                              label="Continue"
                              icon="arrow-circle-right"
                              type="submit"
                              size="lg"
                              shape="pill"
                              fill="outline"
                              colors={{
                                on: {
                                  bg: 'yellow-500',
                                  border: 'yellow-500',
                                  content: 'gray-900',
                                },
                                off: 'yellow-500',
                              }}
                              loading={t.eq(status, ctx.status.loading)}
                            />
                          </ctx.Row>
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
                            margin: { right: 3 },
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
                          reverse
                          as={ctx.Link}
                          label="Continue to Sign-in"
                          to="/account/sign-in"
                          icon="sign-in-alt"
                          type="submit"
                          size="lg"
                          shape="pill"
                          fill="outline"
                          colors={{
                            on: {
                              bg: 'yellow-500',
                              border: 'yellow-500',
                              content: 'gray-900',
                            },
                            off: 'yellow-500',
                          }}
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
