# Z1 Lib Feature Macros

Standard macros over both state and ui concerns aimed to reduce repetitive code while implementing the Z1 style managed development pipeline.

## Install

```
yarn add @z1/lib-feature-macros
```

## Usage

### /features/account/state/main.js

```JavaScript

import { composeStateBox } from '@z1/lib-feature-box'
import { macroRouteViewState } from '@z1/lib-feature-macros'

// views
import { views } from '../views'

// parts
import { auth } from './auth'

// main
const name = 'account'
export const accountState = composeStateBox({ name }, [
  auth,
  macroRouteViewState(name, { path: '/account', views: views.state }),
])

```

### /features/account/ui/AccountPage.jsx

```JavaScript

import React from 'react'
import { task, connectState } from '@z1/lib-feature-box'
import { renderView } from '@z1/lib-feature-macros'

// elements
import { elements } from './elements'

// views
import { views } from '../views'

// state
const stateQuery = ({ account, brand }) => ({ brand, state: account })

// main
export const AccountPage = task(
  t => ({ ui: { VStack, ...ui }, mutationCreators }) => {
    const Elements = elements({ VStack, ...ui })
    const Views = views.ui({ VStack, ...ui, ...Elements })
    return connectState(stateQuery, mutationCreators)(
      ({ brand, state, mutations }) => {
        return (
          <VStack
            x="center"
            y="center"
            box={{ color: brand.secondary, height: 'full' }}
          >
            {renderView(Views, state, mutations)}
          </VStack>
        )
      }
    )
  }
)

```

### /features/account/views/sign-up/main.jsx

```JavaScript

import React from 'react'
import { task, VIEW_STATUS } from '@z1/lib-feature-box'
import { createView } from '@z1/lib-feature-macros'

// schema
import { signUpSchema } from './schema'

// main
export const signUp = task((t, a) =>
  createView('sign-up', {
    state: {
      data({ type, status, viewData, error }) {
        return {
          status,
          data: t.merge(viewData, {
            mode: t.and(t.eq(type, 'form-transmit-complete'), t.isNil(error))
              ? 'view'
              : 'form',
          }),
          error,
        }
      },
      form({ type, formData }) {
        return t.merge(
          {
            data: formData,
          },
          signUpSchema({ disabled: t.eq(type, 'form-transmit') })
        )
      },
      async transmit({ status, api, formData }) {
        const [checkError] = await a.of(
          api.service('auth-management').create({
            action: 'checkUnique',
            value: {
              email: formData.email,
            },
          })
        )
        if (checkError) {
          return {
            status,
            data: formData,
            error: checkError.message,
          }
        }
        const [userError, userResult] = await a.of(
          api.service('users').create(
            t.mergeAll([
              formData,
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
            data: formData,
            error: userError.message,
          }
        }
        return {
          status,
          data: userResult,
          error: null,
        }
      },
    },
    ui: ({
      HStack,
      ViewContainer,
      ViewHeading,
      ViewButton,
      ViewForm,
      Text,
      ViewLink,
      ViewAlert,
      Match,
      When,
    }) => ({ state, mutations }) => {
      const containerProps = t.eq(state.data.mode, 'view')
        ? { large: true, center: true }
        : {}
      return (
        <ViewContainer {...containerProps}>
          <Match
            value={state.data.mode}
            when={{
              view: (
                <React.Fragment>
                  <ViewHeading
                    title="Thank you for registering a Z1 account"
                    text="Your account verification link has been sent to the entered email."
                    box={{ color: 'yellow-500' }}
                  />
                  <HStack box={{ padding: { top: 8 } }}>
                    <ViewButton
                      to="/account/sign-in"
                      text="Continue to Sign-in"
                      radius="full"
                      box={{
                        justifyContent: 'center',
                        display: 'flex',
                        flexDirection: 'row',
                      }}
                      color="green-500"
                    />
                  </HStack>
                </React.Fragment>
              ),
              form: (
                <React.Fragment>
                  <ViewHeading
                    title="Sign-up for a Z1 Account"
                    text="Enter your new account details below."
                  />
                  <When is={t.not(t.isNil(state.error))}>
                    <ViewAlert
                      icon="exclamation-triangle"
                      text={state.error}
                      color="orange-500"
                      bgColor={null}
                      box={{ borderWidth: 2, borderColor: 'orange-500' }}
                    />
                  </When>
                  <ViewForm
                    schema={state.form.schema}
                    uiSchema={state.form.uiSchema}
                    formData={state.form.data}
                    onSubmit={({ formData }) =>
                      mutations.formTransmit({ data: formData })
                    }
                  >
                    <HStack box={{ padding: { y: 4 } }}>
                      <ViewButton
                        type="submit"
                        text="Sign-up"
                        loading={t.eq(state.status, VIEW_STATUS.LOADING)}
                        radius="full"
                      />
                    </HStack>
                    <HStack
                      x="center"
                      y="center"
                      box={{
                        padding: { bottom: 4 },
                        flexDirection: ['col', { lg: 'row' }],
                        flexWrap: true,
                      }}
                    >
                      <Text
                        as={'div'}
                        alignX="center"
                        size="lg"
                        color={'gray-500'}
                        box={{ margin: { y: 2 } }}
                      >
                        Already have an account?
                      </Text>
                      <ViewLink
                        to={'/account/sign-in'}
                        textBox={{ width: 'full' }}
                      >
                        Sign-in to Z1
                      </ViewLink>
                    </HStack>
                  </ViewForm>
                </React.Fragment>
              ),
            }}
          />
        </ViewContainer>
      )
    },
  })
)

```

### /features/account/views/index.js

```JavaScript
import { combineViews } from '@z1/lib-feature-macros'

// views
import { changePassword } from './change-password'
import { notAuthorized } from './not-authorized'
import { resetPassword } from './reset-password'
import { signIn } from './sign-in'
import { signUp } from './sign-up'
import { verify } from './verify'

// main
export const views = combineViews([
  changePassword,
  notAuthorized,
  resetPassword,
  signIn,
  signUp,
  verify,
])

```

### /features/account/main.js

```JavaScript
import { createFeature } from '@z1/lib-feature-box'
import { routeActions } from '@z1/lib-feature-macros'

// state
import { accountState } from './state'

// ui
import { AccountPage } from './ui'

// exports
export const account = createFeature(({ ui }) => {
  return {
    name: 'account',
    state: [accountState],
    routes: [
      {
        type: routeActions(accountState.actions),
        ui: AccountPage({ ui, mutationCreators: accountState.mutations }),
      },
    ],
  }
})

```
