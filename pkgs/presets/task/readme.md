# Z1 Preset Task

Documentation under construction.

A simple wrapper over ramda and other commonly used functions in the @z1 Lib.
reduces the dependancy on imports from one component to the next. Javascript operators are as reliable as wikipedia.

## Usage

### Install

```
yarn add @z1/preset-task
```

### Import

```JavaScript

import { task } from '@z1/preset-task'

```

### Example 
```Javascript 

const fn = task((t,a) => { /* t = syncFN , a = asyncFN */ })

const channel = task(t => ({
  config: channelList => app => {
    if (t.notType(app.channel, 'Function')) {
      // If no real-time functionality has been configured
      // just return
      return null
    }
    if (t.isZeroLen(channelList)) {
      defaultChannelConfig(app)
    } else {
      t.forEach(channel => {
        channel(app)
      }, channelList || [])
    }
  },
}))

```

### Top level functions

#### Sync
| fn                 | custom fn          | usage                                                | docs                                                                            |
| ------------------ | ------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------- |
| at                 |                    | t.at(pathAt, object)                                 | [at](./src/sync.js#L144)                                                        |
| atOr               |                    | t.atOr(fallback, pathAt, object)                     | [atOr](./src/sync.js#L147)                                                      |
| addIndex           |                    | t.addIndex((value, index) => {}, object)             | [addIndex](https://ramdajs.com/docs/#addIndex)                                  |
| adjust             |                    | t.adjust(index, R.toUpper, list)                     | [adjust](https://ramdajs.com/docs/#adjust)                                      |
| and                |                    | t.any([a → Boolean, b → Boolean])                    | [and](https://ramdajs.com/docs/#and)                                            |
| anyOf              | :heavy_check_mark: | t.anyOf([a → Boolean, b → Boolean, ...])             | [anyOf](./src/sync.js#L131)                                                     |
| allOf              | :heavy_check_mark: | t.allOf([a → Boolean, b → Boolean, ...])             | [allOf](./src/sync.js#L137)                                                     |
| append             |                    | t.append(object, object)                             | [append](https://ramdajs.com/docs/#append)                                      |
| compose            |                    | t.compose(t.toUpper ,(a => `${a}`)))                 | [compose](https://ramdajs.com/docs/#compose)                                    |
| concat             |                    | t.concat(object, object)                             | [concat](https://ramdajs.com/docs/#concat)                                      |
| dropLast           |                    | t.dropLast(n, array/string )                         | [dropLast](https://ramdajs.com/docs/#dropLast)                                  |
| endsWith           |                    | t.endWith(object, listOfObjects)                     | [endsWith](https://ramdajs.com/docs/#endsWith)                                  |
| equals             |                    | t.equals(object, object)                             | [equals](https://ramdajs.com/docs/#equals)                                      |
| eq                 | :heavy_check_mark: | t.eq(object, object)                                 | shorthand for equals                                                            |
| neq                | :heavy_check_mark: | t.neq(object, object)                                | pipe(equals, not)                                                               |
| filter             |                    | t.filter(fn, list)                                   | [filter](https://ramdajs.com/docs/#filter)                                      |
| find               |                    | t.find(fn, list)                                     | [find](https://ramdajs.com/docs/#find)                                          |
| findIndex          |                    | t.findIndex(fn, list)                                | [findIndex](https://ramdajs.com/docs/#findIndex)                                |
| flatten            |                    | t.flatten([replaced, [remainder, toAdd]])            | [flatten](https://ramdajs.com/docs/#flatten)                                    |
| forEach            |                    | t.forEach(fn, object)                                | [forEach](https://ramdajs.com/docs/#forEach)                                    |
| forEachObjIndexed  |                    | t.forEachObjIndexed((value, key), object)            | [forEachObjIndexed](https://ramdajs.com/docs/#forEachObjIndexed)                |
| fromPairs          |                    | t.fromPairs(objectOfPairs)                           | [fromPairs](https://ramdajs.com/docs/#fromPairs)                                |
| groupBy            |                    | t.groupBy(fn)                                        | [groupBy](https://ramdajs.com/docs/#groupBy)                                    |
| gt                 |                    | t.gt(a-> int/string, b-> int/string)                 | [gt](https://ramdajs.com/docs/#gt)                                              |
| gte                |                    | t.gte(a-> int/string, b-> int/string)                | [gte](https://ramdajs.com/docs/#gte)                                            |
| has                |                    | t.has(key)({ key: value })                           | [has](https://ramdajs.com/docs/#has)                                            |
| hasIn              |                    | t.hasIn(prop, object)                                | [hasIn](https://ramdajs.com/docs/#hasIn)                                        |
| head               |                    | t.head(list/string)                                  | [head](https://ramdajs.com/docs/#head)                                          |
| includes           |                    | t.includes(object, list/string)                      | [includes](https://ramdajs.com/docs/#includes)                                  |
| isEmpty            |                    | t.isEmpty(object/list)                               | [isEmpty](https://ramdajs.com/docs/#isEmpty)                                    |
| notEmpty           |                    | t.notEmpty(object/list)                              | pipe(isEmpty, not)                                                              |
| isNil              |                    | t.isNil(value)                                       | [isNil](https://ramdajs.com/docs/#isNil)                                        |
| notNil             |                    | t.notNil(value)                                      | pipe(isNil, not)                                                                |
| keys               |                    | t.keys(object)                                       | [keys](https://ramdajs.com/docs/#keys)                                          |
| keysIn             |                    | t.keysIn(object)                                     | [keysIn](https://ramdajs.com/docs/#keysIn)                                      |
| last               |                    | t.last(list/string)                                  | [last](https://ramdajs.com/docs/#last)                                          |
| length             |                    | t.length(list/string)                                | [length](https://ramdajs.com/docs/#length)                                      |
| len                |                    | t.len(list/string)                                   | shorthand for `length`                                                          |
| lt                 |                    | t.lt(a → int/string, b → int/string)                 | [lt](https://ramdajs.com/docs/#lt)                                              |
| lte                |                    | t.lte(a → int/string, b → int/string)                | [lte](https://ramdajs.com/docs/#lte)                                            |
| map                |                    | t.map(fn, list)                                      | [map](https://ramdajs.com/docs/#map)                                            |
| mapIndexed         | :heavy_check_mark: | t.mapIndex((value, index) => {}, list)               | addIndex(map)                                                                   |
| mapObjIndexed      |                    | t.mapObjIndexed(fn, list)                            | [mapObjIndexed](https://ramdajs.com/docs/#mapObjIndexed)                        |
| merge              |                    | t.merge(object/list, object/list)                    | [merge](https://ramdajs.com/docs/#merge)                                        |
| mergeAll           |                    | t.mergeAll(object/list, object/list)                 | [mergeAll](https://ramdajs.com/docs/#mergeAll)                                  |
| mergeDeepRight     |                    | t.mergeDeepRight(object/list, object/list)           | [mergeDeepRight](https://ramdajs.com/docs/#mergeDeepRight)                      |
| not                |                    | t.not(boolean)                                       | [not](https://ramdajs.com/docs/#not)                                            |
| omit               |                    | t.omit([keyA,keyB], list/object)                     | [omit](https://ramdajs.com/docs/#omit)                                          |
| or                 |                    | t.or(a → Boolean, b → Boolean, ...)                  | [or](https://ramdajs.com/docs/#or)                                              |
| path               |                    | t.path([key, ...], object)                           | [path](https://ramdajs.com/docs/#path)                                          |
| pathOr             |                    | t.pathOr(fallback, [key, ...], object)               | [pathOr](https://ramdajs.com/docs/#pathOr)                                      |
| pick               |                    | t.pick([keys], object)                               | [pick](https://ramdajs.com/docs/#pick)                                          |
| pipe               |                    | t.pipe(fn,fn,...)                                    | [pipe](https://ramdajs.com/docs/#pipe)                                          |
| pluck              |                    | t.pluck(prop)                                        | [pluck](https://ramdajs.com/docs/#pluck)                                        |
| prepend            |                    | t.prepend(item, object)                              | [prepend](https://ramdajs.com/docs/#prepend)                                    |
| prop               |                    | t.prop(key, object/list)                             | [prop](https://ramdajs.com/docs/#prop)                                          |
| range              |                    | t.range(from, to)                                    | [range](https://ramdajs.com/docs/#range)                                        |
| reduce             |                    | t.reduce(fn, object, list)                           | [reduce](https://ramdajs.com/docs/#reduce)                                      |
| repeat             |                    | t.repeat(object/list/string, x)                      | [repeat](https://ramdajs.com/docs/#repeat)                                      |
| replace            |                    | t.replace(toReplace, replceWith, string)             | [replace](https://ramdajs.com/docs/#replace)                                    |
| sort               |                    | t.sort((a,b) => a - b)                               | [sort](https://ramdajs.com/docs/#sort)                                          |
| sortBy             |                    | t.sortBy(t.prop(0))                                  | [sortBy](https://ramdajs.com/docs/#sortBy)                                      |
| sortWith           |                    | t.sortWith([fn, fn, ...])                            | [sortWith](https://ramdajs.com/docs/#sortWith)                                  |
| descend            |                    | t.sort(t.descend(t.Prop(0)), list)                   | [descend](https://ramdajs.com/docs/#descend)                                    |
| ascend             |                    | t.sort(t.ascend(t.Prop(0)), list)                    | [ascend](https://ramdajs.com/docs/#ascend)                                      |
| reverse            |                    | t.reverse(list/string)                               | [reverse](https://ramdajs.com/docs/#reverse)                                    |
| split              |                    | t.split(toSplitOn, string)                           | [split](https://ramdajs.com/docs/#split)                                        |
| startsWith         |                    | t.startsWith(string,string)                          | [startsWith](https://ramdajs.com/docs/#startsWith)                              |
| slice              |                    | t.slice(fromIndex(inclusive), toIndex(exclusive), string, string) | [split](https://ramdajs.com/docs/#slice)                          |
| sum                |                    | t.sum(list)                                          | [sum](https://ramdajs.com/docs/#sum)                                            |
| tail               |                    | t.tail(list)                                         | [tail](https://ramdajs.com/docs/#tail)                                          |
| take               |                    | t.take(number, list)                                 | [take](https://ramdajs.com/docs/#take)                                          |
| takeLast           |                    | t.takeLast(number, list)                             | [takeLast](https://ramdajs.com/docs/#takeLast)                                  |
| toPairs            |                    | t.toPairs(object)                                    | [toPairs](https://ramdajs.com/docs/#toPairs)                                   |
| toString           |                    | t.toString(number/object/list)                       | [toString](https://ramdajs.com/docs/#toString)                                  |
| trim               |                    | t.trim(string)                                       | [trim](https://ramdajs.com/docs/#trim)                                          |
| tryCatch           |                    | t.tryCatch(fn, fn)                                   | [tryCatch](https://ramdajs.com/docs/#tryCatch)                                  |
| type               |                    | t.type(*)                                            | [type](https://ramdajs.com/docs/#type)                                          |
| update             |                    | t.update(index, value, list)                         | [update](https://ramdajs.com/docs/#update)                                      |
| uniq               |                    | t.uniq(list)                                         | [uniq](https://ramdajs.com/docs/#uniq)                                          |
| values             |                    | t.values(object)                                     | [values](https://ramdajs.com/docs/#values)                                      |
| isType             | :heavy_check_mark: | t.isType(object, string)                             | equals(toLower(rType(subject)), toLower(matcher))                               |
| ofType             | :heavy_check_mark: | t.ofType(matcher, subject)                           | [ofType](./src/syncjs#L101)                                                     |
| notType            | :heavy_check_mark: | t.notType(fn,'Object')                               | (subject, typeKey) => not(isType(subject, typeKey))                             |
| when               |                    | t.when(a → Boolean, fn)                              | [when](https://ramdajs.com/docs/#when)                                          |
| isZeroLen          | :heavy_check_mark: | t.isZeroLen(list/string)                             | [isZeroLen](./src/sync.js#L141)                                                 |
| notZeroLen         | :heavy_check_mark: | t.notZeroLen(])                                      | pipe(isZeroLen, not)                                                            |
| noLen              | :heavy_check_mark: | t.noLen(list/string)                                 | `isZeroLen`                                                                     |
| hasLen             | :heavy_check_mark: | t.hasLen(list/string)                                | `notZeroLen`                                                                    |
| valPipe            | :heavy_check_mark: | t.valPipe                                            | val => (...args) => pipe(...args)(val)                                          |
| vPipe              | :heavy_check_mark: | t.vPipe                                              | valPipe                                                                         |
| runMatch           | :heavy_check_mark: | t.runMatch()                                         | [runMatch](./src/sync.js#L117)                                                  |
| getMatch           | :heavy_check_mark: | t.getMatch(prop.match)(match)                        | [getMatch](./src/sync.js#L103)                                                  |
| match              | :heavy_check_mark: |                                                      | [match](./src/sync.js#L116)                                                     |
| to                 |                    | t.to.fn(string)                                      | [to](https://ramdajs.com/docs/#addIndex)                                        |
| caseTo             |                    | t.caseTo(string)                                     | Same as above `to` fn                                                           |
| html               |                    | t.html(string)                                       | [html](https://github.com/zspecza/common-tags#html)                             |
| safeHtml           |                    | t.safeHtml(string)                                   | [safeHtml](https://github.com/zspecza/common-tags#safehtml)                     |
| oneLine            |                    | t.oneLine(`multiline string`)                        | [oneLine](https://github.com/zspecza/common-tags#oneLine)                       |
| oneLineTrim        |                    | t.oneLineTrim(`multiline string`)                    | [oneLineTrim](https://github.com/zspecza/common-tags#oneLineTrim)               |
| stripIndent        |                    | t.stripIndent(string)                                | [stripIndent](https://github.com/zspecza/common-tags#stripIndent)               |
| stripIndents       |                    | t.stripIndents(string)                               | [stripIndents](https://github.com/zspecza/common-tags#stripIndents)             |
| inlineLists        |                    | t.lineLists(string)                                  | [inlineLists](https://github.com/zspecza/common-tags#inlineLists)               |
| oneLineInlineLists |                    | t.oneLineInlineLists(list)                           | [oneLineInlineLists](https://github.com/zspecza/common-tags#oneLineInlineLists) |
| commaLists         |                    | t.commaLists(list)                                   | [commaLists](https://github.com/zspecza/common-tags#commaLists)                 |
| oneLineCommaLists  |                    | t.oneLineCommaLists(list)                            | [oneLineCommaLists](https://github.com/zspecza/common-tags#oneLineCommaLists)   |
| globrex            |                    | t.globrex(pattern).regex.test(string)                | [globrex](https://github.com/terkelg/globrex)                                   |
| throttle           |                    | t.throttle(fn, number [options={}])                  | [throttle](https://lodash.com/docs/#throttle)                                   |
| trampoline         | :heavy_check_mark: | t.trampoline(async function rollup(props){})         | [trampoline](./src/sync.js#L122)                                                |



#### async

| fn                 | custom fn          | usage                                                | docs                                                                            |
| ------------------ | ------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------- |
| event              | :heavy_check_mark: |  a.event(server, 'listen')                           |  Waits for `emitter` to emit an `eventName` event.                              |
| callback           | :heavy_check_mark: |  a.callback(fs.readFile, 'foo.txt')                  |  Calls a function `func` that takes arguments `args` and an `(err, result)` callback. Waits for the callback result, throwing an Error if err is truthy.                                                     |
| awaited            | :heavy_check_mark: |  a.awaited(fs.readFile)                              | Wraps a node style function (see `callback`) into a new function, which instead of taking a callback function, returns an async function (`Promise`). This `Promise` resolves if the first (error) argument of the callback was called with a falsy value, rejects with the error otherwise. Takes the rest of the arguments as the original function `fn`. |
| single             | :heavy_check_mark: |  a.single([ fetch(remoteFile), read(localFile) ])    | Waits for the first Promise in `list` to resolve.                               |
| set                | :heavy_check_mark: |  a.set([fn, fn,...,], count)                         | Waits for the first `count` Promises in `list` to resolve.                      |
| list               | :heavy_check_mark: |  a.list([fn, fn, ...]                                | Waits for all Promises in `list` to resolve.                                    |
| object             | :heavy_check_mark: |  a.object({container: fn, foo: fn, bar: fn, ...})    | Waits for all Promises in the keys of `container` to resolve.                   |
| map                | :heavy_check_mark: |  a.map(list, concurrency, fn)                        | Passes each item in `list` to the Promise-returning function `fn`, running at most `concurrency` simultaneous promises.     |
| failure            | :heavy_check_mark:  |  a.failure(promise)                                 | Waits for `promise` to reject, returning the Error object. If `promise` resolves successfully, returns `undefined`.    |
| success            | :heavy_check_mark: |  a.success(promise)                                  | Waits for the value of `promise`. If `promise` throws an Error, returns `undefined`.        |
| result             | :heavy_check_mark: |  a.result(promise)                                   | Waits for `promise` to resolve or reject. Returns either the resolved value, or the Error object.      |
| of                 | :heavy_check_mark: |                                                      | Waits for `promise` to resolve or reject. Returns either the resolved value, or the Error object.                                                                                |
