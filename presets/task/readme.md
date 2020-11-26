# Z1 Preset Task

Documentation under construction.

## Usage

### Install

```
yarn add @z1/preset-task
```

### Import

```JavaScript

import * from '@z1/preset-task'

```

### Top level functions



| fn                 | backwards compatible | custom fn          | usage                      | docs |
| ------------------ | -------------------- | ------------------ | -------------------------- | ---- | 
| addIndex           |                      |                    |   t.addIndex   | [addIndex](https://ramdajs.com/docs/#addIndex) |
| allPass            |                      |                    |   | [allPass](https://ramdajs.com/docs/#allPass)                                                                     | [allPass]()  |
| anyPass            |                      |                    |                            | [anyPass](https://ramdajs.com/docs/#anyPass)                                                                     | [anyPass]()  |
| and                |                      |                    |                            | [and](https://ramdajs.com/docs/#and)                                                                         | [and]()      |
| anyOf              |                      |                    |                            | [anyOf](https://ramdajs.com/docs/#anyOf)                                                                       | [anyOf]()    |
| allOf              |                      | :heavy_check_mark: |            |                | [allOf](https://ramdajs.com/docs/#allOf) |
| append             |                      |                    |                            | [append](https://ramdajs.com/docs/#append)                                                                      |
| composev           |                      |                    |                            | [composev](https://ramdajs.com/docs/#composev)                                                                    |
| concat             |                      |                    |                            | [concat](https://ramdajs.com/docs/#concat)                                                                      |
| contains           |                      |                    |                            | [contains](https://ramdajs.com/docs/#contains)                                                                    |
| dropLast           |                      |                    |                            | [dropLast](https://ramdajs.com/docs/#dropLast)                                                                    |
| endsWith           |                      |                    |                            | [endsWith](https://ramdajs.com/docs/#endsWith)                                                                    |
| equals             |                      |                    |                            | [equals](https://ramdajs.com/docs/#equals)                                                                      |
| eq                 |                      | :heavy_check_mark: |                            | [eq](https://ramdajs.com/docs/#eq)                                                                          |
| neq                |                      |                    |                            | [neq](https://ramdajs.com/docs/#neq)                                                                         |
| filter             |                      |                    |                            | [filter](https://ramdajs.com/docs/#filter)                                                                      |
| find               |                      |                    |                            | [find](https://ramdajs.com/docs/#find)                                                                        |
| findIndex          |                      |                    |                            | [findIndex](https://ramdajs.com/docs/#findIndex)                                                                   |
| flatten            |                      |                    |                            | [flatten](https://ramdajs.com/docs/#flatten)                                                                     |
| forEach            |                      |                    |                            | [forEach](https://ramdajs.com/docs/#forEach)                                                                     |
| forEachObjIndexed  |                      |                    |                            | [forEachObjIndexed](https://ramdajs.com/docs/#forEachObjIndexed)                                                           |
| fromPairs          |                      |                    |                            | [fromPairs](https://ramdajs.com/docs/#fromPairs)                                                                   |
| groupBy            |                      |                    |                            | [groupBy](https://ramdajs.com/docs/#groupBy)                                                                     |
| gt                 |                      |                    |                            | [gt](https://ramdajs.com/docs/#gt)                                                                          |
| gte                |                      |                    |                            | [gte](https://ramdajs.com/docs/#gte)                                                                         |
| has                |                      |                    |                            | [has](https://ramdajs.com/docs/#has)                                                                         |
| hasIn              |                      |                    |                            | [hasIn](https://ramdajs.com/docs/#hasIn)                                                                       |
| head               |                      |                    |                            | [head](https://ramdajs.com/docs/#head)                                                                        |
| includes           |                      |                    |                            | [includes](https://ramdajs.com/docs/#includes)                                                                    |
| isEmpty            |                      |                    |                            | [isEmpty](https://ramdajs.com/docs/#isEmpty)                                                                     |
| isNil              |                      |                    |                            | [isNil](https://ramdajs.com/docs/#isNil)                                                                       |
| keys               |                      |                    |                            | [keys](https://ramdajs.com/docs/#keys)                                                                        |
| keysIn             |                      |                    |                            | [keysIn](https://ramdajs.com/docs/#keysIn)                                                                      |
| last               |                      |                    |                            | [last](https://ramdajs.com/docs/#last)                                                                        |
| length             |                      |                    |                            | [length](https://ramdajs.com/docs/#length)                                                                      |
| len                |                      |                    |                            | [len](https://ramdajs.com/docs/#len)                                                                         |
| lt                 |                      |                    |                            | [lt](https://ramdajs.com/docs/#lt)                                                                          |
| lte                |                      |                    |                            | [lte](https://ramdajs.com/docs/#lte)                                                                         |
| map                |                      |                    |                            | [map](https://ramdajs.com/docs/#map)                                                                         |
| mapIndexed         |                      | :heavy_check_mark: |                            | [addIndex](https://ramdajs.com/docs/#mapIndexed)                                                                    |
| mapObjIndexed      |                      |                    |                            | [mapObjIndexed](https://ramdajs.com/docs/#mapObjIndexed)                                                               |
| merge              |                      |                    |                            | [merge](https://ramdajs.com/docs/#merge)                                                                       |
| mergeAll           |                      |                    |                            | [mergeAll](https://ramdajs.com/docs/#mergeAll)                                                                      |
| mergeDeepRight     |                      |                    |                            | [mergeDeepRight](https://ramdajs.com/docs/#mergeDeepRight)                                                              |
| not             |                      |                    |                            | [not](https://ramdajs.com/docs/#not)                                                                         |
| omit            |                      |                    |                            | [omit](https://ramdajs.com/docs/#omit)                                                                        |
| or              |                      |                    |                            | [or](https://ramdajs.com/docs/#or)                                                                          |
| path            |                      |                    |                            | [path](https://ramdajs.com/docs/#path)                                                                        |
| pathOr          |                      |                    |                            | [pathOr](https://ramdajs.com/docs/#pathOr)                                                                      |
| pick            |                      |                    |                            | [pick](https://ramdajs.com/docs/#pick)                                                                        |
| pickAll         |                      |                    |                            | [pickAll](https://ramdajs.com/docs/#pickAll)                                                                     |
| pickBy          |                      |                    |                            | [pickBy](https://ramdajs.com/docs/#pickBy)                                                                      |
| pipe            |                      |                    |                            | [pipe](https://ramdajs.com/docs/#pipe)                                                                        |
| pluck           |                      |                    |                            | [pluck](https://ramdajs.com/docs/#pluck)                                                                       |
| prepend         |                      |                    |                            | [prepend](https://ramdajs.com/docs/#prepend)                                                                     |
| prop            |                      |                    |                            | [prop](https://ramdajs.com/docs/#prop)                                                                        |
| propEq          |                      |                    |                            | [propEq](https://ramdajs.com/docs/#propEq)                                                                      |
| range           |                      |                    |                            | [range](https://ramdajs.com/docs/#range)                                                                       |
| reduce          |                      |                    |                            | [reduce](https://ramdajs.com/docs/#reduce)                                                                      |
| repeat          |                      |                    |                            | [repeat](https://ramdajs.com/docs/#repeat)                                                                      |
| replace        |                      |                    |                            | [replace](https://ramdajs.com/docs/#replace)                                                                     |
| sort            |                      |                    |                            | [sort](https://ramdajs.com/docs/#sort)                                                                        |
| sortBy          |                      |                    |                            | [sortBy](https://ramdajs.com/docs/#sortBy)                                                                      |
| sortWith        |                      |                    |                            | [sortWith](https://ramdajs.com/docs/#sortWith)                                                                    |
| descend         |                      |                    |                            | [descend](https://ramdajs.com/docs/#descend)                                                                     |
| ascend          |                      |                    |                            | [ascend](https://ramdajs.com/docs/#ascend)                                                                      |
| reverse         |                      |                    |                            | [reverse](https://ramdajs.com/docs/#reverse)                                                                     |
| split           |                      |                    |                            | [split](https://ramdajs.com/docs/#split)                                                                       |
| startsWith      |                      |                    |                            | [startsWith](https://ramdajs.com/docs/#startsWith)                                                                  |
| sum             |                      |                    |                            | [sum](https://ramdajs.com/docs/#sum)                                                                         |
| tail            |                      |                    |                            | [tail](https://ramdajs.com/docs/#tail)                                                                        |
| take            |                      |                    |                            | [take](https://ramdajs.com/docs/#take)                                                                        |
| takeLast        |                      |                    |                            | [takeLast](https://ramdajs.com/docs/#takeLast)                                                                    |
| toPairs        | :heavy_check_mark:   |                    |                            | [toPairs])(https://ramdajs.com/docs/#toPairs)                                                                    |
| toString        | :heavy_check_mark:   |                    |                            | [toString](https://ramdajs.com/docs/#toString)                                                                    |
| trim            |                      |                    |                            | [trim](https://ramdajs.com/docs/#trim)                                                                        |
| tryCatch        |                      |                    |                            | [tryCatch](https://ramdajs.com/docs/#tryCatch)                                                                    |
| type            |                      |                    |                            | [type](https://ramdajs.com/docs/#type)                                                                        |
| uniq            |                      |                    |                            | [uniq](https://ramdajs.com/docs/#uniq)                                                                        |
| values          |                      |                    |                            | [values](https://ramdajs.com/docs/#values)                                                                      |
| isType          |                      |                    |                            | [isType](https://ramdajs.com/docs/#isType)                                                                      |
| when            |                      |                    |                            | [when](https://ramdajs.com/docs/#when)                                                                        |
| notType            |                      | :heavy_check_mark: | t.notType(()=>{},'Object') | (subject, typeKey) => not(isType(subject, typeKey))                             |
| isZeroLen       |                      |  :heavy_check_mark: |  | |
| notZeroLen         |                      | :heavy_check_mark: | t.notZeroLen(])            | pipe(isZeroLen, not)                                                            |
| valPipe            |                      | :heavy_check_mark: | t.valPipe                  | val => (...args) => pipe(...args)(val)                                          |
| runMatch        |                      | :heavy_check_mark: |                            | [runMatch](https://ramdajs.com/docs/#runMatch)                                                                    |
| getMatch        |                      | :heavy_check_mark: |                            | [getMatch](https://ramdajs.com/docs/#addIndex)                                                                    |
| match          |                      |  :heavy_check_mark: |                            | [match](https://ramdajs.com/docs/#addIndex)                                                                       |
| to             |                      |                    |                            | [to](https://ramdajs.com/docs/#addIndex)                                                                          |
| caseTo          | :heavy_check_mark:   |                    |                            | [caseTo](https://ramdajs.com/docs/#addIndex)                                                                      |
| html               |                      |                    |                            | [html](https://github.com/zspecza/common-tags#html)                             |
| safeHtml           |                      |                    |                            | [safeHtml](https://github.com/zspecza/common-tags#safehtml)                     |
| oneLine            |                      |                    |                            | [oneLine](https://github.com/zspecza/common-tags#oneLine)                       |
| oneLineTrim        |                      |                    |                            | [oneLineTrim](https://github.com/zspecza/common-tags#oneLineTrim)               |
| stripIndent        |                      |                    |                            | [stripIndent](https://github.com/zspecza/common-tags#stripIndent)               |
| stripIndents       |                      |                    |                            | [stripIndents](https://github.com/zspecza/common-tags#stripIndents)             |
| inlineLists        |                      |                    |                            | [inlineLists](https://github.com/zspecza/common-tags#inlineLists)               |
| oneLineInlineLists |                      |                    |                            | [oneLineInlineLists](https://github.com/zspecza/common-tags#oneLineInlineLists) |
| commaLists         |                      |                    |                            | [commaLists](https://github.com/zspecza/common-tags#commaLists)                 |
| oneLineCommaLists  |                      |                    |                            | [oneLineCommaLists](https://github.com/zspecza/common-tags#oneLineCommaLists)   |
| globrex            |                      |                    |                            | [globrex](https://github.com/terkelg/globrex)                                                                     |
| throttle           |                      |                    |                            | [throttle](https://lodash.com/docs/#throttle)                                                                    |
| trampoline         |                      |  :heavy_check_mark: |                            | 
