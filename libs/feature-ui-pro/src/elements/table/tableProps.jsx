import z from '@z1/lib-feature-box'

// parts
import { ExpandIcon } from './elements/ExpandIcon'
import { SortIndicator } from './elements/SortIndicator'

// main
export const tableProps = z.fn((t) => (props = {}) => {
  return t.mergeAll([
    {
      fixed: true,
      rowHeight: 46,
      components: t.merge(
        {
          ExpandIcon,
          SortIndicator,
        },
        {},
        t.atOr({}, 'components', props)
      ),
    },
    t.and(
      t.notNil(props.expandColumnKey),
      t.hasLen(t.atOr('', 'expandColumnKey', props))
    )
      ? {
          expandIconProps: (p) => {
            return t.merge(p, {
              indentSize: 16,
            })
          },
        }
      : {},
    t.omit(['components'], props),
  ])
})
