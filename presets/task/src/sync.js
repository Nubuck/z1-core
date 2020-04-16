import addIndex from 'ramda/es/addIndex'
import adjust from 'ramda/es/adjust'
import and from 'ramda/es/and'
import append from 'ramda/es/append'
import compose from 'ramda/es/compose'
import concat from 'ramda/es/concat'
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
import pipe from 'ramda/es/pipe'
import pluck from 'ramda/es/pluck'
import prepend from 'ramda/es/prepend'
import prop from 'ramda/es/prop'
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
import update from 'ramda/es/update'
import uniq from 'ramda/es/uniq'
import values from 'ramda/es/values'
import when from 'ramda/es/when'
// case
import { camelCase } from 'camel-case'
import { snakeCase } from 'snake-case'
import { pathCase } from 'path-case'
import { sentenceCase } from 'sentence-case'
import { dotCase } from 'dot-case'
import { paramCase } from 'param-case'
// tags
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
// utils
import { globrex } from './globrex'
import throttle from 'lodash.throttle'
// types
const isType = (subject, matcher) =>
  equals(toLower(rType(subject)), toLower(matcher))
const ofType = (matcher, subject) => isType(subject, matcher)
// pattern match
const getMatch = (key) => (cases) => {
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
const match = (cases) => (key) => getMatch(`${key}`)(cases)
const runMatch = (cases) => (key, value = {}) => {
  const matched = match(cases)(key)
  return isType(matched, 'function') ? matched(value) : null
}
// utils
const trampoline = (fn) => (...args) => {
  let result = fn(...args)
  while (isType(result, 'function')) {
    result = result()
  }
  return result
}
const valPipe = (val) => (...args) => pipe(...args)(val)
// logic
const anyOf = (list = []) => {
  return gt(
    findIndex((subject) => equals(subject, true), list),
    -1
  )
}
const allOf = (list = []) => {
  return equals(length(filter((subject) => equals(subject, false), list)), 0)
}
// new alias: noLen + hasLen
const isZeroLen = (subject) => equals(length(subject), 0)
const notZeroLen = pipe(isZeroLen, not)
// deep path
const at = (pathAt, subject = {}) => {
  return path(split('.', pathAt), subject)
}
const atOr = (other, pathAt, subject = {}) => {
  return pathOr(other, split('.', pathAt), subject)
}
// transform
const to = {
  camelCase,
  constantCase: pipe(snakeCase, toUpper),
  dotCase,
  paramCase,
  pathCase,
  sentenceCase,
  snakeCase,
  lowerCase: toLower,
  upperCase: toUpper,
  pairs: toPairs,
  string: toString,
}
// main
export const TASK = {
  at,
  atOr,
  addIndex,
  adjust,
  and,
  anyOf,
  allOf,
  append,
  compose,
  concat,
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
  pipe,
  pluck,
  prepend,
  prop,
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
  update,
  uniq,
  values,
  isType,
  ofType,
  when,
  notType: (subject, typeKey) => not(isType(subject, typeKey)),
  // should deprecate: isZeroLen for shorter noLen
  isZeroLen,
  notZeroLen,
  noLen: isZeroLen,
  hasLen: notZeroLen,
  valPipe,
  vPipe: valPipe,
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
