import React from 'react'
import z from '@z1/lib-feature-box'
import { HStack, Icon, Box, When } from '@z1/lib-ui-box-elements'

// main
export const SearchInput = z.fn((t) => (props) => {
  const matcher = t.atOr('', 'matcher', props)
  const onSearch = t.atOr(() => {}, 'onSearch', props)
  const onReset = t.atOr(() => {}, 'onReset', props)
  const box = t.atOr({}, 'box', props)
  const nextProps = t.omit(
    ['matcher', 'onSearch', 'onReset', 'box', 'placeholder'],
    props
  )
  const hasMatcher = t.hasLen(matcher)
  const color = hasMatcher ? 'blue-500' : 'gray-400'
  const placeholder = t.atOr('search...', 'placeholder', props)
  return (
    <HStack
      key="search-box"
      y="center"
      box={{
        borderWidth: 2,
        borderColor: color,
        color,
        padding: { x: 3, y: 1 },
        borderRadius: 'full',
      }}
      next={(b) => b.next(box)}
      style={{ minWidth: 280 }}
      {...nextProps}
    >
      <Icon name="search" size="xl" margin={{ right: 2 }} />
      <Box
        key="search-input"
        as="input"
        tabIndex="0"
        type="text"
        placeholder={placeholder}
        fontSize="sm"
        box={{
          display: 'flex',
          border: 0,
          outline: 'none',
          bgColor: 'transparent',
          flex: 1,
        }}
        value={matcher}
        onChange={(e) => {
          e.preventDefault()
          e.stopPropagation()
          onSearch(e.target.value)
        }}
      />
      <When
        is={hasMatcher}
        render={() => (
          <Icon
            name="close"
            size="xl"
            color={[null, { hover: 'white' }]}
            cursor="pointer"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onReset()
            }}
          />
        )}
      />
    </HStack>
  )
})
