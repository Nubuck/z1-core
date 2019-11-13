import React from 'react'
import { task } from '@z1/preset-task'

// main
export const Match = task(t => props => {
    const cases = t.pathOr({}, ['when'], props)
    const handleCases = t.pathOr({}, ['renderWhen'], props)
    const value = t.pathOr(null, ['value'], props)
    const nextProps = t.omit(['value', 'when', 'renderWhen'], props)
    const matched = t.has(value)(cases)
      ? { render: cases[value], type: 'value' }
      : t.has(value)(handleCases)
      ? { render: handleCases[value], type: 'handler' }
      : null
    const nextElseCase = t.isNil(matched)
      ? t.has('_')(cases)
        ? { render: cases['_'], type: 'value' }
        : t.has('_')(handleCases)
        ? { render: handleCases['_'], type: 'handler' }
        : null
      : null
    const nextMatched = t.and(t.isNil(matched), t.isNil(nextElseCase))
      ? null
      : t.isNil(matched)
      ? nextElseCase
      : matched
    return t.isNil(nextMatched)
      ? null
      : t.eq(nextMatched.type, 'value')
      ? nextMatched.render
      : React.createElement(nextMatched.render, nextProps)
  })