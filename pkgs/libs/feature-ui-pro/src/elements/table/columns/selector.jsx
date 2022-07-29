import React from 'react'
import z from '@z1/lib-feature-box'
import {  Button } from '@z1/lib-ui-box-elements'

// main
export const selector = z.fn((t) => (props) => {
  return t.mergeDeepRight(props, {
    resizable: false,
    headerRenderer: ({ column }) => {
      return (
        <Button
          key="select_all"
          shape="circle"
          fill="solid"
          size="xs"
          icon={{ name: 'check', fontSize: 'base' }}
          margin={{ x: 'auto' }}
          style={{ width: '1.2rem', height: '1.2rem' }}
          borderWidth={true}
          colors={{
            off: {
              border: 'gray-600',
              bg: 'gray-900',
              content: 'transparent',
            },
            on: {
              border: 'green-500',
              bg: 'green-500',
              content: 'white',
            },
          }}
          box={{
            borderRadius: 'sm',
            borderColor: ['gray-600', { hover: 'green-500' }],
          }}
          onClick={() => {
            column.onChange && column.onChange('header', null)
          }}
        />
      )
    },
    cellRenderer: ({ rowData, column, cellData }) => {
      return (
        <Button
          key={`${cellData}_Check`}
          shape="circle"
          fill="solid"
          size="xs"
          icon={{ name: 'check', fontSize: 'base' }}
          margin={{ x: 'auto' }}
          style={{ width: '1.2rem', height: '1.2rem' }}
          borderWidth={true}
          colors={{
            off: {
              border: 'gray-500',
              bg: 'gray-800',
              content: 'transparent',
            },
            on: {
              border: 'green-500',
              bg: 'green-500',
              content: 'white',
            },
          }}
          box={{
            borderRadius: 'sm',
            borderColor: ['gray-500', { hover: 'green-500' }],
          }}
          onClick={() => {
            column.onChange && column.onChange('cell', cellData)
          }}
        />
      )
    },
  })
})
