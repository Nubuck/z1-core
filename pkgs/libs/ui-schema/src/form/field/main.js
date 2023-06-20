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
    const name = t.isType(nameOrProps, 'string') ? nameOrProps : 'none'
    const noName = t.eq(name, 'none') 
    const props = noName ? nameOrProps : propsOrChildren
    const children = noName ? propsOrChildren : childrenOrAdditional
    const additional = noName ? childrenOrAdditional : otherAdditional
    const ui = t.atOr({}, 'ui', props)
    const required = t.atOr(false, 'required', props)
    // next
    // NOTE: Make fieldKey camelCase if issues occur of not being camelCase
    // const fieldKey = t.to.camelCase(name)
    const fieldKey = name
    const baseType = t.atOr('string', 'type', props)
    const fieldType = t.eq(baseType, 'array')
      ? isFixedItemList(children, additional)
        ? 'fixedArray'
        : baseType
      : baseType
    const fieldProps = t.omit(['ui', 'required'], props)
    // yield
    return (ctx, parent) => {
      const xProps = t.atOr(
        t.eq(parent, 'fixedArray') ? [] : {},
        'props',
        ctx
      )
      const xUi = t.atOr(t.eq(parent, 'fixedArray') ? [] : {}, 'ui', ctx)
      const xRequired = t.atOr([], 'required', ctx)
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
