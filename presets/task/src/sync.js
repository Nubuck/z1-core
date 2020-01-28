import addIndex from 'ramda/es/addIndex'
import allPass from 'ramda/es/allPass'
import anyPass from 'ramda/es/anyPass'
import and from 'ramda/es/and'
import append from 'ramda/es/append'
import compose from 'ramda/es/compose'
import concat from 'ramda/es/concat'
import contains from 'ramda/es/contains'
import dropLast from 'ramda/es/dropLast'
import endsWith from 'ramda/es/endsWith'
import equals from 'ramda/es/equals'
import filter from 'ramda/es/filter'
import find from 'ramda/es/find'
import findIndex from 'ramda/es/findIndex'
import flatten from 'ramda/es/flatten'
import forEach from 'ramda/es/forEach'
import forEachObjIndexed from 'ramda/es/forEachObjIndexed'
import fromPairs from 'ramda/es/fromPairs'
import groupBy from 'ramda/es/groupBy'
import gt from 'ramda/es/gt'
import gte from 'ramda/es/gte'
import has from 'ramda/es/has'
import hasIn from 'ramda/es/hasIn'
import head from 'ramda/es/head'
import includes from 'ramda/es/includes'
import isEmpty from 'ramda/es/isEmpty'
import isNil from 'ramda/es/isNil'
import keys from 'ramda/es/keys'
import keysIn from 'ramda/es/keysIn'
import last from 'ramda/es/last'
import length from 'ramda/es/length'
import lt from 'ramda/es/lt'
import lte from 'ramda/es/lte'
import map from 'ramda/es/map'
import mapObjIndexed from 'ramda/es/mapObjIndexed'
import merge from 'ramda/es/merge'
import mergeAll from 'ramda/es/mergeAll'
import mergeDeepRight from 'ramda/es/mergeDeepRight'
import not from 'ramda/es/not'
import omit from 'ramda/es/omit'
import or from 'ramda/es/or'
import path from 'ramda/es/path'
import pathOr from 'ramda/es/pathOr'
import pick from 'ramda/es/pick'
import pickAll from 'ramda/es/pickAll'
import pickBy from 'ramda/es/pickBy'
import pipe from 'ramda/es/pipe'
import pluck from 'ramda/es/pluck'
import prepend from 'ramda/es/prepend'
import prop from 'ramda/es/prop'
import propEq from 'ramda/es/propEq'
import range from 'ramda/es/range'
import reduce from 'ramda/es/reduce'
import repeat from 'ramda/es/repeat'
import replace from 'ramda/es/replace'
import sum from 'ramda/es/sum'
import sort from 'ramda/es/sort'
import sortBy from 'ramda/es/sortBy'
import sortWith from 'ramda/es/sortWith'
import descend from 'ramda/es/descend'
import ascend from 'ramda/es/ascend'
import reverse from 'ramda/es/reverse'
import split from 'ramda/es/split'
import startsWith from 'ramda/es/startsWith'
import tail from 'ramda/es/tail'
import take from 'ramda/es/take'
import takeLast from 'ramda/es/takeLast'
import toLower from 'ramda/es/toLower'
import toUpper from 'ramda/es/toUpper'
import toPairs from 'ramda/es/toPairs'
import toString from 'ramda/es/toString'
import trim from 'ramda/es/trim'
import tryCatch from 'ramda/es/tryCatch'
import rType from 'ramda/es/type'
import uniq from 'ramda/es/uniq'
import values from 'ramda/es/values'
import when from 'ramda/es/when'

import { camelCase } from 'camel-case'
import { snakeCase } from 'snake-case'
import { pathCase } from 'path-case'
import { sentenceCase } from 'sentence-case'
import { dotCase } from 'dot-case'
import { constantCase } from 'constant-case'
import { paramCase } from 'param-case'

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

const isType = (subject, matcher) =>
  equals(toLower(rType(subject)), toLower(matcher))

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

const match = cases => key => getMatch(`${key}`)(cases)

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

const isZeroLen = subject => equals(length(subject), 0)

const at = (pathAt, subject = {}) => {
  return path(split('.', pathAt), subject)
}
const atOr = (other, pathAt, subject = {}) => {
  return pathOr(other, split('.', pathAt), subject)
}
const to = {
  camelCase,
  constantCase,
  dotCase,
  paramCase,
  pathCase,
  sentenceCase,
  snakeCase,
  lowerCase: toLower,
  upperCase: toLower,
  pairs: toPairs,
  string: toString,
}

export const TASK = {
  at,
  atOr,
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
  neq: pipe(equals, not),
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
  notEmpty: pipe(isEmpty, not),
  isNil,
  notNil: pipe(isNil, not),
  keys,
  keysIn,
  last,
  length,
  len: length,
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
  replace,
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
  // back compat
  toPairs,
  // back compat
  toString,
  trim,
  tryCatch,
  type: rType,
  uniq,
  values,
  isType,
  when,
  notType: (subject, typeKey) => not(isType(subject, typeKey)),
  isZeroLen,
  notZeroLen: pipe(isZeroLen, not),
  valPipe: val => (...args) => pipe(...args)(val),
  runMatch,
  getMatch,
  match,
  to,
  // back compat
  caseTo: to,
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
