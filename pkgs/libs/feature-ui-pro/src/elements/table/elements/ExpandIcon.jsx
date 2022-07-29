import React from 'react'
import z from '@z1/lib-feature-box'
import { Col, Button, When, toCss } from '@z1/lib-ui-box-elements'

// main
export const ExpandIcon = z.fn(
  (t) =>
    ({ expandable, expanded, indentSize, depth, onExpand, ...rest }) => {
      if (
        t.anyOf([
          t.and(t.not(expandable), t.eq(0, indentSize)),
          t.notType(depth, 'number'),
          t.notType(indentSize, 'number'),
        ])
      ) {
        return null
      }
      // not supporting higher than this for sanity sake
      const indentMulti = t.gt(depth, 3)
        ? depth * depth + 24
        : t.gt(depth, 2)
        ? depth * depth + 16
        : t.gt(depth, 1)
        ? depth * 2
        : 1
      return (
        <div
          {...rest}
          className={toCss({
            display: 'flex',
            flex: 'none',
            flexDirection: 'col',
            justifyContent: 'center',
            alignItems: 'center',
            padding: { left: 2, right: 1 },
            minHeight: 'full',
            // bgColor: t.and(expandable, t.eq(depth, 0)) ? 'gray-800' : null,
            className: `BaseTable__expand-icon${
              t.eq(true, expanded) ? ' BaseTable__expand-icon--expanded' : ''
            }`,
          })}
          onClick={
            t.and(t.eq(true, expandable), t.ofType('function', onExpand))
              ? (e) => {
                  e.stopPropagation()
                  e.preventDefault()
                  onExpand(t.not(expanded))
                }
              : null
          }
          style={{
            cursor: 'pointer',
            userSelect: 'none',
            marginLeft: depth * indentSize + indentMulti,
          }}
        >
          <When
            is={expandable}
            render={() => {
              return (
                <Button
                  shape="normal"
                  fill="solid"
                  size="xs"
                  opacity={1}
                  flex="initial"
                  style={{
                    height: '20px',
                    width: '20px',
                    minWidth: '20px',
                  }}
                  colors={{
                    off: {
                      border: 'gray-500',
                      bg: 'gray-800',
                      content: 'gray-400',
                    },
                    on: {
                      border: 'blue-500',
                      bg: 'blue-500',
                      content: 'white',
                    },
                  }}
                  slots={{
                    content: { flex: 1 },
                  }}
                  box={{
                    borderWidth: [true, { hover: true }],
                    borderColor: ['gray-500', { hover: 'blue-500' }],
                    borderRadius: 'sm',
                    padding: 0,
                    margin: t.gt(depth, 1) ? { left: 2 } : null,
                  }}
                  icon={{
                    name: 'angle-right',
                    fontSize: 'sm',
                    transition: 'all',
                    className: expanded ? 'la-rotate-90' : null,
                  }}
                />
              )
            }}
          />
        </div>
      )
    }
)
