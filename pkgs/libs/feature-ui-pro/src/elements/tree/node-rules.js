import z from '@z1/lib-feature-box'

// main
export const nodeRules = z.fn((t) => {
  return {
    canDrag({ node }) {
      return t.and(
        t.neq('share', t.at('shape', node)),
        t.neq('share', t.at('origin', node)),
        t.neq('trash', t.at('shape', node))
      )
    },
    canDrop(p) {
      const nodeId = t.replace('table_', '', t.at('node._id', p))
      const trashed = t.at('nextParent.trashed', p)
      const nodeParentId = t.at('node.parentId', p)
      const parentId = t.at('nextParent._id', p)
      const homeId = t.at('node.homeId', p)
      const nextParentId = t.isNil(parentId) ? homeId : parentId
      return t.allOf([
        t.neq(nodeParentId, nextParentId),
        t.neq(nodeId, nextParentId),
        t.not(t.includes(t.at('shape', p.nextParent), ['file', 'share'])),
        t.neq('share', t.at('origin', p.nextParent)),
        t.neq(true, trashed),
      ])
    },
    canNodeHaveChildren({ node }) {
      const trashed = t.at('trashed', node)
      return t.and(
        t.not(t.includes(t.at('shape', node), ['file', 'share'])),
        t.neq('share', t.at('origin', node)),
        t.neq(true, trashed)
      )
    },
  }
})
