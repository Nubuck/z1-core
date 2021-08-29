import z from '@z1/lib-feature-box'
import nanoid from 'nanoid'
import { removeElements, addEdge } from 'react-flow-renderer'

// main
export const onNodeDragStart = (node) => console.log('drag start', node)
export const onNodeDragStop = (node) => console.log('drag stop', node)
export const onElementClick = (element) => console.log('click', element)
export const onSelectionChange = (elements) =>
  console.log('selection change', elements)
export const onLoad = (reactFlowInstance) => {
  console.log('graph loaded:', reactFlowInstance)
  // reactFlowInstance.fitView()
}
export const onElementsRemove = (els, setElements) => (elementsToRemove) => {
  console.log('ELS TO REMOVE', elementsToRemove)
  const next = removeElements(elementsToRemove, els)
  setElements(next)
}
export const onConnect = z.fn((t) => (els, setElements, params) => {
  console.log('CONNECT PARAMS', params)
  const next = addEdge(
    t.merge(params, {
      type: 'pro',
      id: nanoid(),
      label: 'X',
      labelStyle: { borderRadius: '100%' },
      style: { stroke: '#48bb78', strokeWidth: 4 },
      animated: true,
      label: {
        test: () => {
          console.log('TEST')
        },
      },
    }),
    els
  )
  console.log('CONNECT NEXT', els, next)
  setElements(next)
})
