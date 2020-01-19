import fn from '@z1/preset-task'

// parts
import { keys } from './keys'
import { renderChildren } from './common'
import { fieldSchema } from './fieldSchema'

// main
export const parentSchema = fn(t =>
  t.match({
    root(ctx) {
      if (t.not(t.includes(ctx.fieldType, ['object', 'array']))) {
        return {
          schema: t.merge(ctx.fieldProps, { required: ctx.required }),
          uiSchema: ctx.ui,
        }
      }
      if (t.eq(ctx.fieldType, 'fixedArray')) {
        const nextChildren = renderChildren(
          { props: [], ui: [], required: [] },
          ctx.fieldType,
          ctx.children
        )
        const nextAdditional = renderChildren(
          { props: {}, ui: {}, required: [] },
          'additionalItems',
          ctx.additional
        )
        return {
          schema: t.merge(ctx.fieldProps, {
            required: nextChildren.required,
            items: nextChildren.props,
            additionalItems: nextAdditional.props,
          }),
          uiSchema: t.mergeAll([ctx.ui, next.ui, nextAdditional.ui]),
        }
      }
      const next = renderChildren(
        { props: {}, ui: {}, required: [] },
        ctx.fieldType,
        ctx.children
      )
      const childKey = t.eq(ctx.fieldType, 'array')
        ? keys.field.items
        : keys.field.props
      return {
        schema: t.merge(ctx.fieldProps, {
          required: next.required,
          [childKey]: next.props,
        }),
        uiSchema: t.merge(ctx.ui, next.ui),
      }
    },
    object(ctx) {
      const next = fieldSchema(ctx.fieldType)(ctx)
      return {
        props: t.merge(ctx.xProps, {
          [ctx.fieldKey]: next.props,
        }),
        ui: t.merge(ctx.xUi, {
          [ctx.fieldKey]: next.ui,
        }),
        required: next.required,
      }
    },
    array(ctx) {
      const next = fieldSchema(ctx.fieldType)(ctx)
      return {
        props: t.merge(ctx.xProps, next.props),
        ui: t.merge(ctx.xUi, next.ui),
      }
    },
    fixedArray(ctx) {
      const next = fieldSchema(ctx.fieldType)(ctx)
      return {
        props: t.concat(ctx.xProps, [next.props]),
        ui: t.concat(ctx.xUi, [next.ui]),
      }
    },
    additionalItems(ctx) {
      const next = fieldSchema(ctx.fieldType)(ctx)
      return {
        props: next.props,
        ui: next.ui,
      }
    },
  })
)
