import React from 'react'
import z from '@z1/lib-feature-box'
import { HStack, Icon, Box, When } from '@z1/lib-ui-box-elements'

// main
export const SearchInput = z.fn((t) => (props) => {
  const matcher = t.atOr('', 'matcher', props)
  const onSearch = t.atOr(() => {}, 'onSearch', props)
  const onReset = t.atOr(() => {}, 'onReset', props)
  const box = t.atOr({}, 'box', props)
  const nextProps = t.omit(['matcher', 'onSearch', 'onReset', 'box'], props)
  return (
    <HStack
      key="search-box"
      y="center"
      box={{
        borderWidth: 2,
        borderColor: 'blue-500',
        color: 'blue-500',
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
        placeholder="search..."
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
        is={t.hasLen(matcher)}
        render={() => (
          <Icon
            name="close"
            size="xl"
            margin={{ left: 2 }}
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
