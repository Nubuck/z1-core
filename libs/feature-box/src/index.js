import React from 'react'
import * as core from '@z1/lib-state-box'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { connectRoutes, redirect } from 'redux-first-router'
import restoreScroll from 'redux-first-router-restore-scroll'
// import { NavLink as _NavLink, default as _Link } from 'redux-first-router-link'
export { NavLink, default as Link } from 'redux-first-router-link'
export { NOT_FOUND } from 'redux-first-router'

// export const selectLocationState = ({ location }) => (
//   { location }
// )

// export const NavLink = connect(selectLocationState)(_NavLink)
// export const Link = connect(selectLocationState)(_Link)

const createRoute = core.task(
  t => (actionType, path, props = {}) => {
    return {
      [actionType]: t.merge({ path }, props),
    }
  },
)

export const createStateBox = core.task(
  t => (props) => {
    if (t.isType(
      t.path(['routes'], props),
      'Function',
    )) {
      const box = core.createStateBox(props)
      return t.merge(box, {
        routes: t.mergeAll(props.routes(createRoute, box.actions) || []),
      })
    }
    return core.createStateBox(props)
  },
)

export const composeStateBox = core.task(
  t => (props, parts) => {
    const nextParts = t.reduce(
      (collection, part) => {
        return {
          initial: t.not(t.has('initial')(part))
                   ? collection.initial
                   : t.mergeDeepRight(collection.initial, part.initial || {}),
          mutations: t.not(t.has('mutations')(part))
                     ? collection.mutations
                     : t.concat(collection.mutations, [part.mutations]),
          routes: t.not(t.has('routes')(part))
                  ? collection.routes
                  : t.concat(collection.routes, [part.routes]),
          guards: t.not(t.has('guards')(part))
                  ? collection.guards
                  : t.concat(collection.guards, [part.guards]),
          effects: t.not(t.has('effects')(part))
                   ? collection.effects
                   : t.concat(collection.effects, [part.effects]),
          onInit: t.not(t.has('onInit')(part))
                  ? collection.onInit
                  : t.concat(collection.onInit, [part.onInit]),
        }
      },
      {
        initial: {},
        mutations: [],
        routes: [],
        guards: [],
        effects: [],
        onInit: [],
      },
      parts || [],
    )
    return createStateBox(t.mergeAll([
      {
        initial: t.mergeDeepRight(
          nextParts.initial || {},
          props.initial || {},
        ),
      },
      t.omit(['initial'], props || {}),
      {
        mutations(m) {
          return t.flatten(t.map(
            mutation => mutation(m),
          )(nextParts.mutations || []))
        },
        routes(r, actions) {
          return t.flatten(t.map(
            route => route(r, actions),
          )(nextParts.routes || []))
        },
        guards(g, box) {
          return t.flatten(t.map(
            guard => guard(g, box),
          )(nextParts.guards || []))
        },
        effects(fx, box) {
          return t.flatten(t.map(
            effect => effect(fx, box),
          )(nextParts.effects || []))
        },
        onInit(ctx) {
          t.forEach(
            onInit => onInit(ctx),
            nextParts.onInit || [],
          )
        },
      },
    ]))
  },
)

export const combineStateBoxes = core.task(
  t => boxes => core.combineStateBoxes(
    boxes,
    (nextBoxes, box) => {
      return {
        routes: t.merge(
          nextBoxes.routes || {},
          box.routes,
        ),
      }
    },
  ),
)

export const createStateStore = core.task(
  t => (props = {}) => {
    const combinedBoxes = combineStateBoxes(props.boxes)
    const router = connectRoutes(
      // props.history,
      combinedBoxes.routes,
      t.merge(
        { restoreScroll: restoreScroll() },
        t.not(t.has('routerOptions')(props))
        ? {}
        : props.routerOptions,
      ),
    )
    return core.createStateStore(
      t.merge(t.omit(['routerOptions'], props), {
        context: t.merge(
          props.context,
          { redirect },
        ),
        boxes: combinedBoxes,
        middleware: t.concat(
          props.middleware || [],
          [router.middleware],
        ),
        reducers: t.merge(
          props.reducers || {},
          {
            location: router.reducer,
          },
        ),
        enhance(appliedMiddleware) {
          return [
            compose(router.enhancer, appliedMiddleware),
          ]
        },
      }),
    )
  },
)

export const reloadStateStore = (
  store,
  boxes,
) => core.reloadStateStore(store, combineStateBoxes(boxes))

export const task = core.task

export const combineFeatures = task(
  t => featureList => t.reduce(
    (combinedFeatures, feature) => {
      return {
        state: t.notType(
          t.path(['state'], feature),
          'Array',
        )
               ? combinedFeatures.state
               : t.concat(
            combinedFeatures.state,
            t.path(['state'], feature),
          ),
        ui: t.notType(
          t.path(['ui'], feature),
          'Object',
        )
            ? combinedFeatures.ui
            : t.merge(
            combinedFeatures.ui, {
              [feature.name]: t.path(['ui'], feature),
            },
          ),
        routes: t.notType(
          t.path(['routes'], feature),
          'Array',
        )
                ? combinedFeatures.routes
                : t.concat(
            combinedFeatures.routes,
            t.path(['routes'], feature),
          ),
        tasks: t.notType(
          t.path(['tasks'], feature),
          'Object',
        )
               ? combinedFeatures.tasks
               : t.merge(
            combinedFeatures.tasks, {
              [feature.name]: t.path(['tasks'], feature),
            },
          ),
      }
    },
    {
      state: [],
      ui: {},
      routes: [],
      tasks: {},
    },
    featureList,
  ),
)

export const renderRoute = task(
  t => (actionType, routes) => {
    const matchedDef = t.find(
      routeDef => t.gt(
        t.findIndex(
          type => t.eq(actionType, type),
          t.isType(routeDef.type, 'Array')
          ? routeDef.type
          : [routeDef.type],
        ),
        -1,
      ),
      routes,
    )
    if (!matchedDef.ui) {
      return null
    }
    return React.createElement(
      matchedDef.ui,
      { key: actionType },
    )
  },
)

export const connectState = task(
  t => (selector, mutations = undefined) => connect(
    selector,
    (
      t.notType(mutations, 'Object')
      ? dispatch => {
        return { dispatch }
      }
      : dispatch => {
        return {
          dispatch,
          mutations:
            bindActionCreators(
              mutations,
              dispatch,
            ),
        }
      }
    ),
  ),
)

export const createKit = task(
  t => (initial, factory) => (props = {}) => {
    const ui = t.path(['ui'], props)
    return factory(
      t.merge(
        t.mergeDeepRight(
          initial,
          t.omit(['ui'], props),
        ),
        { ui },
      ),
    )
  },
)

export const createFeature = task(
  t => (factory, initial = {}) => (props = {}) => {
    const ui = t.path(['ui'], props)
    return factory(
      t.merge(
        t.mergeDeepRight(
          initial,
          t.omit(['ui'], props),
        ),
        { ui },
      ),
    )
  },
)

export const VIEW_STATUS = {
  INIT: 'init',
  WAITING: 'waiting',
  READY: 'ready',
  LOADING: 'loading',
  COMPLETE: 'complete',
  SUCCESS: 'success',
  FAIL: 'fail',
}