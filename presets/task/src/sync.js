import {
  addIndex,
  allPass,
  anyPass,
  and,
  append,
  compose,
  concat,
  contains,
  dropLast,
  endsWith,
  equals,
  filter,
  find,
  findIndex,
  flatten,
  forEach,
  forEachObjIndexed,
  fromPairs,
  groupBy,
  gt,
  gte,
  has,
  hasIn,
  head,
  includes,
  isEmpty,
  isNil,
  keys,
  keysIn,
  last,
  length,
  lt,
  lte,
  map,
  mapObjIndexed,
  merge,
  mergeAll,
  mergeDeepRight,
  not,
  omit,
  or,
  path,
  pathOr,
  pick,
  pickAll,
  pickBy,
  pipe,
  pluck,
  prepend,
  prop,
  propEq,
  range,
  reduce,
  repeat,
  sum,
  sort,
  sortBy,
  sortWith,
  descend,
  ascend,
  reverse,
  split,
  startsWith,
  tail,
  take,
  takeLast,
  toLower,
  toPairs,
  toString,
  trim,
  tryCatch,
  type,
  uniq,
  values,
  when,
} from 'ramda'

import {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  headerCase,
  noCase,
  paramCase,
  pascalCase,
  pathCase,
  sentenceCase,
  snakeCase,
} from 'change-case'

import {
  html,
  safeHtml,
  oneLine,
  oneLineTrim,
  stripIndent,
  stripIndents,
  inlineLists,
  oneLineInlineLists,
  commaLists,
  oneLineCommaLists,
} from 'common-tags'

import { globrex } from './globrex'

import throttle from 'lodash.throttle'

const isType = (subject, matcher) => equals(type(subject), matcher)

const getMatch = key => cases => {
  const matched = has(key)(cases) ? cases[key] : null
  const nextElseCase = isNil(matched)
    ? has('_')(cases)
      ? cases['_']
      : null
    : null
  return and(isNil(matched), isNil(nextElseCase))
    ? null
    : isNil(matched)
    ? nextElseCase
    : matched
}

const runMatch = (key, value) => cases => {
  const matched = getMatch(key)(cases)
  return isType(matched, 'Function') ? matched(value) : null
}

const trampoline = fn => (...args) => {
  let result = fn(...args)
  while (typeof result === 'function') {
    result = result()
  }
  return result
}

const anyOf = (list = []) => {
  return gt(
    findIndex(subject => equals(subject, true), list),
    -1
  )
}
const allOf = (list = []) => {
  return equals(length(filter(subject => equals(subject, false), list)), 0)
}

export const TASK = {
  addIndex,
  allPass,
  anyPass,
  and,
  anyOf,
  allOf,
  append,
  compose,
  concat,
  contains,
  dropLast,
  endsWith,
  equals,
  eq: equals,
  filter,
  find,
  findIndex,
  flatten,
  forEach,
  forEachObjIndexed,
  fromPairs,
  groupBy,
  gt,
  gte,
  has,
  hasIn,
  head,
  includes,
  isEmpty,
  isNil,
  keys,
  keysIn,
  last,
  length,
  lt,
  lte,
  map,
  mapIndexed: addIndex(map),
  mapObjIndexed,
  merge,
  mergeAll,
  mergeDeepRight,
  not,
  omit,
  or,
  path,
  pathOr,
  pick,
  pickAll,
  pickBy,
  pipe,
  pluck,
  prepend,
  prop,
  propEq,
  range,
  reduce,
  repeat,
  sort,
  sortBy,
  sortWith,
  descend,
  ascend,
  reverse,
  split,
  startsWith,
  sum,
  tail,
  take,
  takeLast,
  toLower,
  toPairs,
  toString,
  trim,
  tryCatch,
  type,
  uniq,
  values,
  isType,
  when,
  notType: (subject, type) => not(isType(subject, type)),
  isZeroLen: subject => equals(length(subject), 0),
  valPipe: val => (...args) => pipe(...args)(val),
  runMatch,
  getMatch,
  caseTo: {
    camelCase,
    capitalCase,
    constantCase,
    dotCase,
    headerCase,
    noCase,
    paramCase,
    pascalCase,
    pathCase,
    sentenceCase,
    snakeCase,
  },
  tags: {
    html,
    safeHtml,
    oneLine,
    oneLineTrim,
    stripIndent,
    stripIndents,
    inlineLists,
    oneLineInlineLists,
    commaLists,
    oneLineCommaLists,
  },
  globrex,
  throttle,
  trampoline,
}
