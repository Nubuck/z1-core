import fn from '@z1/preset-task'

// parts
import { isFixedItemList, fieldSchema } from './parts'

// main
export const field = fn(
  t => (
    nameOrProps,
    propsOrChildren,
    childrenOrAdditional,
    otherAdditional
  ) => {
    const none = 'none'
    const name = t.isType(nameOrProps, 'string') ? nameOrProps : none
    const props = t.eq(name, none) ? nameOrProps : propsOrChildren
    const children = t.eq(name, none) ? propsOrChildren : childrenOrAdditional
    const additional = t.eq(name, none) ? childrenOrAdditional : otherAdditional
    const ui = t.pathOr({}, ['ui'], props)
    const required = t.pathOr(false, ['required'], props)
    // next
    const fieldKey = t.to.camelCase(name)
    const baseType = t.pathOr('string', ['type'], props)
    const fieldType = t.eq(baseType, 'array')
      ? isFixedItemList(children, additional)
        ? 'fixedArray'
        : baseType
      : baseType
    const fieldProps = t.omit(['ui', 'required'], props)
    // yield
    return (ctx, parent) => {
      const xProps = t.pathOr(
        t.eq(parent, 'fixedArray') ? [] : {},
        ['props'],
        ctx
      )
      const xUi = t.pathOr(t.eq(parent, 'fixedArray') ? [] : {}, ['ui'], ctx)
      const xRequired = t.pathOr([], ['required'], ctx)
      return fieldSchema(parent)({
        name,
        fieldKey,
        fieldType,
        fieldProps,
        children,
        additional,
        ui,
        required,
        xProps,
        xUi,
        xRequired,
      })
    }
  }
)
