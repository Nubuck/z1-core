import z from '@z1/lib-feature-box'

//parts
import nodeContentRenderer from './ProNode'
import { nodeRules } from './node-rules'

// main
/*
Can override the following:
- style: PropTypes.shape({}),
- innerStyle: PropTypes.shape({}),
- reactVirtualizedListProps: PropTypes.shape({}),
- scaffoldBlockPxWidth: PropTypes.number,
- slideRegionSize: PropTypes.number,
- rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.func]),
- treeNodeRenderer: PropTypes.func,
- nodeContentRenderer: PropTypes.func,
- placeholderRenderer: PropTypes.func,
*/
export const proTreeTheme = {
  nodeContentRenderer,
}
export const treeProps = z.fn((t) => (props = {}) => {
  const hasSize = t.and(t.has('width')(props), t.has('height')(props))

  return t.mergeAll([
    {
      rowHeight: 44,
      theme: proTreeTheme,
    },
    nodeRules,
    hasSize ? { style: { width: props.width, height: props.height } } : {},
    hasSize
      ? {
          reactVirtualizedListProps: {
            className: 'pro-tree scrollbar',
            width: props.width,
            height: props.height,
          },
        }
      : {},
    props,
  ])
})
