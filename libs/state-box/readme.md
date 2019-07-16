# Z1 Lib State Box

The Z1 standard state management solution for web apps, implemented as a macro interface over [Redux](https://github.com/reduxjs/redux), [Redux-logic](https://github.com/jeffbski/redux-logic) and [Redux-toolbelt](https://github.com/welldone-software/redux-toolbelt)

Extended from state-box [core](https://github.com/SaucecodeOfficial/zero-one-core/tree/master/libs/state-box-core)

## Install

```
yarn add @z1/lib-state-box
```

## Usage

```JavaScript

import {
  task,
  createStateBox,
  combineStateBoxes,
  createStateStore,
  reloadStateStore,
} from '@z1/lib-state-box'

const appState = task((t, a) =>
  createStateBox({
    name: 'app',
    initial: {
      status: 'init',
      data: null,
      error: null,
    },
    mutations(mutation) {
      return [
        mutation(
          ['dataLoad', 'dataLoadComplete', 'dataLoadInvalid'],
          (state, action) => {
            return t.merge(state, {
              status: t.pathOr('loading', ['payload', 'status'], action),
              data: t.pathOr(state.data, ['payload', 'data'], action),
              error: t.pathOr(null, ['payload', 'error'], action),
            })
          }
        ),
      ]
    },
    guards(guard, box) {
      return [
        guard([box.actions.dataLoad], async ({ action }, allow, reject) => {
          if (t.isNil(action.payload.status)) {
            reject(
              box.mutations.dataLoadInvalid({
                status: 'ready',
                data: null,
                error: 'No Status provided',
              })
            )
          } else {
            allow(action)
          }
        }),
      ]
    },
    effects(effect, box) {
      return [
        effect([box.actions.dataLoad], async ({ api }, dispatch, done) => {
          const [loadError, loadResult] = await a.of(
            api('http://localhost:3030/api/data')
          )
          if (loadError) {
            dispatch(
              mutations.dataLoadComplete({
                status: 'ready',
                data: null,
                error: loadError,
              })
            )
          } else {
            dispatch(
              mutations.dataLoadComplete({
                status: 'ready',
                data: loadResult.json(),
                error: null,
              })
            )
          }
          done()
        }),
      ]
    },
    onInit({ mutations, dispatch }) {
      dispatch(mutations.dataLoad({ status: 'waiting' }))
    },
  })
)

const boxes = combineStateBoxes([appState /* more state boxes */])

const store = createStateStore({
  boxes,
  context: {
    api: window.fetch,
  },
})

if (module.hot) {
  module.hot.accept(['.'], () => {
    reloadStateStore(store, boxes)
  })
}


```
