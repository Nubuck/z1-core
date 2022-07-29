import React from 'react'
import z from '@z1/lib-feature-box'
import { IconLabel } from '@z1/lib-feature-ui/dist/IconLabel'

// main
export const headerRenderer = z.fn((t) => ({ column }) => {
  return (
    <IconLabel
      slots={{ label: { padding: { left: t.isNil(column.icon) ? 2 : 1 } } }}
      label={t.merge(
        {
          text: column.title,
          letterSpacing: 'wider',
          fontSize: 'sm',
          fontWeight: 'normal',
        },
        t.atOr({}, 'label', column)
      )}
      icon={
        t.isNil(column.icon)
          ? null
          : t.ofType('string', column.icon)
          ? { name: column.icon, size: '2xl', padding: { left: 1 } }
          : t.merge({ size: '2xl', padding: { left: 1 } }, column.icon)
      }
      info={
        t.isNil(column.info)
          ? null
          : t.ofType('string', column.info)
          ? { text: column.info, fontSize: 'xs' }
          : t.merge({ fontSize: 'xs' }, column.info)
      }
      display="flex"
      flex={1}
      y="center"
    />
  )
})
