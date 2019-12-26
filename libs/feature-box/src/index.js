import React from 'react'
import { stateBox, fn as Fn } from '@z1/lib-state-box'
import { compose, bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { connectRoutes, redirect } from 'redux-first-router'
import restoreScroll from 'redux-first-router-restore-scroll'

// out
export { NavLink, default as Link } from 'redux-first-router-link'
export { NOT_FOUND } from 'redux-first-router'

// main
export const featureBox = {
  create: null,
  combine: null,
  state: {
    create: null,
    compose: null,
    combine: null,
  },
  store: {
    create: null,
    reload: null,
  },
  ui: {
    connect: null,
    query: null,
    Link,
    NavLink,
  },
  route: {
    render: null,
    actions: null,
    notFound: NOT_FOUND,
  },
}
