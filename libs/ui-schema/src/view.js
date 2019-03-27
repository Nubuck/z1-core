import { task } from '@z1/preset-task'

// view types
const VIEW_SCHEMA = {
  NODE: '@node',
  ui: key => `@${key}`,
  event: key => `#${key}`,
}

// view tasks
const viewProps = task(t => props => {
  // tokens:
  //  @key = ui component
  //  #key = handler
  //  %key = variable: prop type
  // reserved props:
  //  @node = node to be rendered
  // pair props:
  const propsPairs = t.toPairs(props)
  // node: find @node or default to Box.div
  const node = t.find(prop => t.equals(t.head(prop), '@node'), propsPairs)
  // ui -> filter ui components:
  const uiList = t.filter(
    prop =>
      !t.equals(t.head(prop), '@node') && t.equals(t.head(t.head(prop)), '@'),
    propsPairs
  )
  // handlers -> filter handlers:
  const handlerList = t.filter(
    prop => t.equals(t.head(t.head(prop)), '#'),
    propsPairs
  )
  // props -> omit node, ui and handler keys from props:
  const omitList = t.map(prop => t.head(prop), t.concat(uiList, handlerList))
  const nextProps = t.omit(t.concat(['@node'], omitList), props)
  // omit tokens in keys:
  const omitToken = prop => [`${t.tail(t.head(prop))}`, t.head(t.tail(prop))]
  // yield:
  return {
    node: node ? t.head(t.tail(node)) : 'Box',
    props: nextProps,
    ui: t.fromPairs(t.map(omitToken, uiList)),
    handlers: t.fromPairs(t.map(omitToken, handlerList)),
  }
})
const viewNode = task(t => (name = 'view', props = {}, children = []) => {
  const nextProps = viewProps(props)
  const nextChildren = t.equals(t.type(children), 'Array') ? children : []
  const childrenMap = t.mapObjIndexed(
    (value, key) => t.path([key], t.head(value)),
    t.groupBy(child => t.head(t.head(t.toPairs(child))))(nextChildren)
  )
  return {
    [name]: t.merge(nextProps, { children: childrenMap }),
  }
})

// exports
export const viewSchema = factory =>
  factory(
    viewNode,
    task(t =>
      t.mergeDeepRight(VIEW_SCHEMA, {
        CHILDREN: viewNode('Children'),
      })
    )
  )
