import fn from '@z1/preset-task'

// parts
import { renderChildren } from './common'

// main
export const renderField = fn(t =>
  t.match({
    fixedArray(ctx) {
      const nextChildren = renderChildren(
        { props: [], ui: [] },
        'fixedArray',
        ctx.children
      )
      const nextAdditional = renderChildren(
        { props: {}, ui: {} },
        'additionalItems',
        ctx.additional
      )
      return {
        props: t.merge(ctx.fieldProps, {
          items: nextChildren.props,
          additionalItems: nextAdditional.props,
        }),
        ui: t.merge(ctx.ui, {
          items: nextChildren.ui,
          additionalItems: nextAdditional.ui,
        }),
        required: t.eq(ctx.required, true)
          ? t.concat(ctx.xRequired, [ctx.fieldKey])
          : ctx.xRequired,
      }
    },
    array(ctx) {
      const nextChildren = renderChildren(
        { props: {}, ui: ctx.ui },
        'array',
        ctx.children
      )
      return {
        props: t.merge(ctx.fieldProps, {
          items: nextChildren.props,
        }),
        ui: t.merge(ctx.ui, { items: nextChildren.ui }),
        required: t.eq(ctx.required, true)
          ? t.concat(ctx.xRequired, [ctx.fieldKey])
          : ctx.xRequired,
      }
    },
    object(ctx) {
      const nextChildren = renderChildren(
        { props: {}, ui: ctx.ui, required: [] },
        'object',
        ctx.children
      )
      return {
        props: t.merge(ctx.fieldProps, {
          required: nextChildren.required,
          properties: nextChildren.props,
        }),
        ui: t.merge(ctx.ui, nextChildren.ui),
        required: t.eq(ctx.required, true)
          ? t.concat(ctx.xRequired, [ctx.fieldKey])
          : ctx.xRequired,
      }
    },
    _(ctx) {
      return {
        props: ctx.fieldProps,
        ui: ctx.ui,
        required: t.eq(ctx.required, true)
          ? t.concat(ctx.xRequired, [ctx.fieldKey])
          : ctx.xRequired,
      }
    },
  })
)
