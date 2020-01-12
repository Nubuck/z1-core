import { fn } from '@z1/lib-state-box'
import { bindActionCreators } from 'redux'
import { Provider, connect } from 'react-redux'
import { NavLink, default as Link } from 'redux-first-router-link'

// main
export const ui = fn(t => ({
  Provider,
  connect(selector, mutators = undefined) {
    return connect(
      selector,
      t.notType(mutators, 'Object')
        ? dispatch => {
            return { dispatch }
          }
        : dispatch => {
            return {
              dispatch,
              mutations: bindActionCreators(mutators, dispatch),
            }
          }
    )
  },
  query(queryMapping = []) {
    const nextMapping = t.flatten(
      t.map(query => {
        return t.isType(query, 'String')
          ? [
              {
                from: query,
                to: query,
              },
            ]
          : t.map(queryKey => {
              return {
                from: queryKey,
                to: query[queryMapping],
              }
            }, t.keys(query))
      }, queryMapping)
    )
    return state =>
      t.reduce(
        (nextState, queryMap) => {
          return t.merge(nextState, {
            [queryMap.to]: t.pathOr(null, [queryMap.from], state),
          })
        },
        {},
        nextMapping
      )
  },
  NavLink,
  Link,
}))
