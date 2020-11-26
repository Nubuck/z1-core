| fn                                   | backwards compatible | custom fn | usage                                | docs                                                |
|--------------------------------------|----------------------|-----------|--------------------------------------|-----------------------------------------------------|
| addIndex                             |                      |           | addIndex                         |                                                     |
| allPass                          |                      |           | allPass                          |                                                     |
| anyPass                          |                      |           | anyPass                          |                                                     |
| and                              |                      |           | and                              |                                                     |
| anyOf                            |                      |           | anyOf                            |                                                     |
| allOf                            |                      |           | allOf                            |                                                     |
| append                           |                      |           | append                           |                                                     |
| composev                         |                      |           | composev                         |                                                     |
| concat                           |                      |           | concat                           |                                                     |
| contains                         |                      |           | contains                         |                                                     |
| dropLast                         |                      |           | dropLast                         |                                                     |
| endsWith                         |                      |           | endsWith                         |                                                     |
| equals                           |                      |           | equals                           |                                                     |
| eq                               |                      |           | eq                               |                                                     |
| neq                              |                      |           | neq                              |                                                     |
| filter                           |                      |           | filter                           |                                                     |
| find                             |                      |           | find                             |                                                     |
| findIndex                        |                      |           | findIndex                        |                                                     |
| flatten                          |                      |           | flatten                          |                                                     |
| forEach                          |                      |           | forEach                          |                                                     |
| forEachObjIndexed                |                      |           | forEachObjIndexed                |                                                     |
| fromPairs                        |                      |           | fromPairs                        |                                                     |
| groupBy                          |                      |           | groupBy                          |                                                     |
| gt                               |                      |           | gt                               |                                                     |
| gte                              |                      |           | gte                              |                                                     |
| has                              |                      |           | has                              |                                                     |
| hasIn                            |                      |           | hasIn                            |                                                     |
| head                             |                      |           | head                             |                                                     |
| includes                         |                      |           | includes                         |                                                     |
| isEmpty                          |                      |           | isEmpty                          |                                                     |
| isNil                            |                      |           | isNil                            |                                                     |
| keys                             |                      |           | keys                             |                                                     |
| keysIn                           |                      |           | keysIn                           |                                                     |
| last                             |                      |           | last                             |                                                     |
| length                           |                      |           | length                           |                                                     |
| len                              |                      |           | len                              |                                                     |
| lt                               |                      |           | lt                               |                                                     |
| lte                              |                      |           | lte                              |                                                     |
| map                              |                      |           | map                              |                                                     |
| mapIndexed             |                      |   :heavy_check_mark:  | addIndex           |                                                     |
| mapObjIndexed                    |                      |           | mapObjIndexed                    |                                                     |
| merge                            |                      |           | merge                            |                                                     |
| mergeAll                         |                      |           | mergeAll                         |                                                     |
| mergeDeepRight                   |                      |           | mergeDeepRight                   |                                                     |
| not]()                              |                      |           | not]()                              |                                                     |
| omit]()                             |                      |           | omit]()                             |                                                     |
| or]()                               |                      |           | or]()                               |                                                     |
| path]()                             |                      |           | path]()                             |                                                     |
| pathOr]()                           |                      |           | pathOr]()                           |                                                     |
| pick]()                             |                      |           | pick]()                             |                                                     |
| pickAll]()                          |                      |           | pickAll]()                          |                                                     |
| pickBy]()                           |                      |           | pickBy]()                           |                                                     |
| pipe]()                             |                      |           | pipe]()                             |                                                     |
| pluck]()                            |                      |           | pluck]()                            |                                                     |
| prepend]()                          |                      |           | prepend]()                          |                                                     |
| prop]()                             |                      |           | prop]()                             |                                                     |
| propEq]()                           |                      |           | propEq]()                           |                                                     |
| range]()                            |                      |           | range]()                            |                                                     |
| reduce]()                           |                      |           | reduce]()                           |                                                     |
| repeat]()                           |                      |           | repeat]()                           |                                                     |
| replace]()                          |                      |           | replace]()                          |                                                     |
| sort]()                             |                      |           | sort]()                             |                                                     |
| sortBy]()                           |                      |           | sortBy]()                           |                                                     |
| sortWith]()                         |                      |           | sortWith]()                         |                                                     |
| descend]()                          |                      |           | descend]()                          |                                                     |
| ascend]()                           |                      |           | ascend]()                           |                                                     |
| reverse]()                          |                      |           | reverse]()                          |                                                     |
| split]()                            |                      |           | split]()                            |                                                     |
| startsWith]()                       |                      |           | startsWith]()                       |                                                     |
| sum]()                              |                      |           | sum]()                              |                                                     |
| tail]()                             |                      |           | tail]()                             |                                                     |
| take]()                             |                      |           | take]()                             |                                                     |
| takeLast]()                         |                      |           | takeLast]()                         |                                                     |
| toPairs])()                         | :heavy_check_mark:        |           | toPairs])()           |                                                     |
| toString]()                         | :heavy_check_mark:        |           | toString]()           |                                                     |
| trim]()                             |                      |           | trim]()                             |                                                     |
| tryCatch]()                         |                      |           | tryCatch]()                         |                                                     |
| type: rType]()                      |                      |           | type: rType]()                      |                                                     |
| uniq]()                             |                      |           | uniq]()                             |                                                     |
| values]()                           |                      |           | values]()                           |                                                     |
| isType]()                           |                      |           | isType]()                           |                                                     |
| when]()                             |                      |           | when]()                             |                                                     |
| notType                              |                      |    :heavy_check_mark:  | t.notType(()=>{},'Object')           | (subject, typeKey) => not(isType(subject, typeKey)) |
| isZeroLen]()                        |                      |           | isZeroLen]()                        |                                                     |
| notZeroLen                           |                      |  :heavy_check_mark:  | t.notZeroLen(])                     | pipe(isZeroLen, not)                                |
| valPipe                              |                      |  :heavy_check_mark: | t.valPipe                            | val => (...args) => pipe(...args)(val)              |
| runMatch]()                         |                      |           | runMatch]()                         |                                                     |
| getMatch]()                         |                      |           | getMatch]()                         |                                                     |
| match]()                            |                      |           | match]()                            |                                                     |
| to]()                               |                      |           | to]()                               |                                                     |
| caseTo]()                           | :heavy_check_mark:        |           | caseTo]()             |                                                     |
| html              |               |           | [html](https://github.com/zspecza/common-tags#html)               |                                                     |
| safeHtml           |                      |           | [safeHtml](https://github.com/zspecza/common-tags#safehtml)           |                                                     |
| oneLine]() *           |                      |           | [oneLine](https://github.com/zspecza/common-tags#oneLine)            |                                                     |
| oneLineTrim]()         |                      |           | [oneLineTrim](https://github.com/zspecza/common-tags#oneLineTrim)        |                                                     |
| stripIndent]()         |                      |           | [stripIndent](https://github.com/zspecza/common-tags#stripIndent)         |                                                     |
| stripIndents]()        |                      |           | [stripIndents](https://github.com/zspecza/common-tags#stripIndents)        |                                                     |
| inlineLists]()         |                      |           | [inlineLists](https://github.com/zspecza/common-tags#inlineLists)         |                                                     |
| oneLineInlineLists]()  |                      |           | [oneLineInlineLists](https://github.com/zspecza/common-tags#oneLineInlineLists)  |                                                     |
| commaLists           |                      |           | [commaLists](https://github.com/zspecza/common-tags#commaLists)          |                                                     |
| oneLineCommaLists       |                      |           | [oneLineCommaLists](https://github.com/zspecza/common-tags#oneLineCommaLists)   |                                                     |
| globrex]()                          |                      |           | globrex]()                          |                                                     |
| throttle]()                         |                      |           | throttle]()                         |                                                     |
| trampoline]()                       |                      |           | [trampoline                       |                                                     |