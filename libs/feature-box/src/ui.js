import { fn } from '@z1/lib-state-box'
import { bindActionCreators } from 'redux'
import { Provider, connect } from 'react-redux'
import { NavLink, default as Link } from 'redux-first-router-link'

// parts
const query = fn(t => (queryMapping = []) => {
  const mapping = t.isType(queryMapping, 'array')
    ? queryMapping
    : [queryMapping]
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
              to: query[queryKey],
            }
          }, t.keys(query))
    }, mapping)
  )
  return state =>
    t.reduce(
      (nextState, queryMap) => {
        return t.merge(nextState, {
          [queryMap.to]: t.atOr(null, queryMap.from, state),
        })
      },
      {},
      nextMapping
    )
})

// main
export const ui = fn(t => ({
  Provider,
  connect(selector, mutators = undefined, Element = null) {
    const withCnx = connect(
      t.notType(selector, 'function') ? query(selector) : selector,
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
    return t.notNil(Element) ? withCnx(Element) : withCnx
  },
  query,
  NavLink,
  Link,
}))
