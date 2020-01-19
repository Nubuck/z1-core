import fn from '@z1/preset-task'

const keys = {
  object: 'object',
  array: 'array',
  string: 'string',
  number: 'number',
  int: 'integer',
  bool: 'boolean',
  null: 'null',
  ui: {
    placeholder: 'ui:placeholder',
    disabled: 'ui:disabled',
    options: 'ui:options',
    css: 'classNames',
    widget: 'ui:widget',
    field: 'ui:field',
    order: 'ui:order',
    rootId: 'rootFieldId',
  },
  format: {
    email: 'email',
    uri: 'uri',
    dataUrl: 'data-url',
    date: 'date',
    dateTime: 'date-time',
    altDate: 'alt-date',
    altDateTime: 'alt-datetime',
  },
  widget: {
    radio: 'radio',
    checkboxes: 'checkboxes',
    select: 'select',
    textArea: 'textarea',
    password: 'password',
    color: 'color',
    email: 'email',
    uri: 'uri',
    file: 'data-url',
    date: 'date',
    dateTime: 'date-time',
    altDate: 'alt-date',
    altDateTime: 'alt-datetime',
    upDown: 'updown',
    range: 'range',
    readOnly: 'readonly',
    hidden: 'hidden',
    help: 'help',
    number: 'number',
  },
  field: {
    title: 'title',
    desc: 'description',
    type: 'type',
    format: 'format',
    required: 'required',
    props: 'properties',
    items: 'items',
    enum: 'enum',
    enumNames: 'enumNames',
    unique: 'uniqueNames',
    uniqueItems: 'uniqueItems',
    default: 'default',
    anyOf: 'anyOf',
    oneOf: 'oneOf',
  },
}

const none = 'none'
const renderChildren = fn(t => (ctx, parent, children) => {
  return t.reduce((cx, ff) => ff(cx, parent), ctx, children || [])
})
const isFixedItemList = fn(t => (children, additional) => {
  return t.allOf([
    t.gte(t.isType(children, 'array') ? t.len(children) : 0, 1),
    t.or(t.isType(additional, 'object'), t.isType(additional, 'array')),
  ])
})

const createField = fn(
  t => (
    nameOrProps,
    propsOrChildren,
    childrenOrAdditional,
    otherAdditional
  ) => {
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
      // current field
      const renderField = t.match({
        fixedArray: () => {
          const nextChildren = renderChildren(
            { props: [], ui: [] },
            'fixedArray',
            children
          )
          const nextAdditional = renderChildren(
            { props: {}, ui: {} },
            'additionalItems',
            additional
          )
          return {
            props: t.merge(fieldProps, {
              items: nextChildren.props,
              additionalItems: nextAdditional.props,
            }),
            ui: t.merge(ui, {
              items: nextChildren.ui,
              additionalItems: nextAdditional.ui,
            }),
            required: t.eq(required, true)
              ? t.concat(xRequired, [fieldKey])
              : xRequired,
          }
        },
        array: () => {
          const nextChildren = renderChildren(
            { props: {}, ui },
            'array',
            children
          )
          return {
            props: t.merge(fieldProps, {
              items: nextChildren.props,
            }),
            ui: t.merge(ui, { items: nextChildren.ui }),
            required: t.eq(required, true)
              ? t.concat(xRequired, [fieldKey])
              : xRequired,
          }
        },
        object: () => {
          const nextChildren = renderChildren(
            { props: {}, ui, required: [] },
            'object',
            children
          )
          return {
            props: t.merge(fieldProps, {
              required: nextChildren.required,
              properties: nextChildren.props,
            }),
            ui: t.merge(ui, nextChildren.ui),
            required: t.eq(required, true)
              ? t.concat(xRequired, [fieldKey])
              : xRequired,
          }
        },
        _: () => {
          return {
            props: fieldProps,
            ui,
            required: t.eq(required, true)
              ? t.concat(xRequired, [fieldKey])
              : xRequired,
          }
        },
      })
      // parent field
      const nextSchema = t.match({
        root: () => {
          if (t.not(t.includes(fieldType, ['object', 'array']))) {
            return {
              schema: t.merge(fieldProps, { required }),
              uiSchema: ui,
            }
          }

          if (t.eq(fieldType, 'fixedArray')) {
            const nextChildren = renderChildren(
              { props: [], ui, required: [] },
              fieldType,
              children
            )
            const nextAdditional = renderChildren(
              { props: {}, ui, required: [] },
              'additionalItems',
              additional
            )
            return {
              schema: t.merge(fieldProps, {
                required: nextChildren.required,
                items: nextChildren.props,
                additionalItems: nextAdditional.props,
              }),
              uiSchema: t.mergeAll([ui, next.ui, nextAdditional.ui]),
            }
          }
          const next = renderChildren(
            { props: {}, ui, required: [] },
            fieldType,
            children
          )
          const childKey = t.eq(fieldType, 'array')
            ? keys.field.items
            : keys.field.props
          return {
            schema: t.merge(fieldProps, {
              required: next.required,
              [childKey]: next.props,
            }),
            uiSchema: t.merge(ui, next.ui),
          }
        },
        object: () => {
          const next = renderField(fieldType)()
          return {
            props: t.merge(xProps, {
              [fieldKey]: next.props,
            }),
            ui: t.merge(xUi, {
              [fieldKey]: next.ui,
            }),
            required: next.required,
          }
        },
        array: () => {
          const next = renderField(fieldType)()
          return {
            props: t.merge(xProps, next.props),
            ui: t.merge(xUi, next.ui),
          }
        },
        fixedArray: () => {
          const next = renderField(fieldType)()
          return {
            props: t.concat(xProps, [next.props]),
            ui: t.concat(xUi, [next.ui]),
          }
        },
        additionalItems: () => {
          const next = renderField(fieldType)()
          return {
            props: next.props,
            ui: next.ui,
          }
        },
      })(parent)
      // result
      return t.isType(nextSchema, 'function') ? nextSchema() : ctx
    }
  }
)

const form = fn(t => factory => {
  const formSchema = factory(createField, keys)
  const nextSchema = t.isType(formSchema, 'array')
    ? t.head(formSchema)
    : formSchema
  return nextSchema({}, 'root')
})

const demo = form((f, k) =>
  f({ type: k.object }, [
    f('name', {
      type: k.string,
      title: 'Name',
      required: true,
      ui: {
        [k.ui.placeholder]: 'Macro name',
        [k.ui.disabled]: false,
        [k.ui.css]: 'macro-box',
      },
    }),
    f('mouseMove', { type: k.object }, [
      f('posX', {
        type: k.string,
        title: 'Position X',
        required: true,
        ui: {
          [k.ui.placeholder]: 'Position X',
          [k.ui.disabled]: false,
          [k.ui.css]: 'x-box',
        },
      }),
      f('posY', {
        type: k.string,
        title: 'Position Y',
        required: true,
        ui: {
          [k.ui.placeholder]: 'Position Y',
          [k.ui.disabled]: false,
          [k.ui.css]: 'y-box',
        },
      }),
    ]),
    f('basicList', { type: k.array }, [
      f({
        type: k.string,
        title: 'Item Name',
        required: true,
        ui: {
          [k.ui.placeholder]: 'Item name',
          [k.ui.disabled]: false,
          [k.ui.css]: 'item-box',
        },
      }),
    ]),
    f('objList', { type: k.array }, [
      f({ type: k.object }, [
        f('objName', {
          type: k.string,
          title: 'Object Name',
          required: true,
          ui: {
            [k.ui.placeholder]: 'Object name',
            [k.ui.disabled]: false,
            [k.ui.css]: 'item-box',
          },
        }),
      ]),
    ]),
    f(
      'fixedList',
      { type: k.array },
      [
        f({
          type: k.string,
          title: 'Item Name',
          required: true,
          ui: {
            [k.ui.placeholder]: 'Item name',
            [k.ui.disabled]: false,
            [k.ui.css]: 'fixed-item-name',
          },
        }),
        f({
          type: k.string,
          title: 'Item Type',
          required: true,
          ui: {
            [k.ui.placeholder]: 'Item type',
            [k.ui.disabled]: false,
            [k.ui.css]: 'fixed-item-type',
          },
        }),
      ],
      [
        f({
          type: k.string,
          title: 'Additional Type',
          required: true,
          ui: {
            [k.ui.placeholder]: 'Item type',
            [k.ui.disabled]: false,
            [k.ui.css]: 'fixed-additional-type',
          },
        }),
      ]
    ),
  ])
)

const print = fn(t => () => {
  console.log('DEMO SCHEMA', t.omit(['properties'], demo.schema))
  t.forEach(key => {
    console.log('SCHEMA PROP', key, demo.schema.properties[key])
    const itemProps = t.pathOr(
      null,
      ['schema', 'properties', key, 'items', 'properties'],
      demo
    )
    if (t.not(t.isNil(itemProps))) {
      t.forEach(itemKey => {
        console.log('ITEM PROP', itemKey, itemProps[itemKey])
      }, t.keys(itemProps))
    }
  }, t.keys(demo.schema.properties))
  t.forEach(key => {
    console.log('UI SCHEMA PROP', key, demo.uiSchema[key])
  }, t.keys(demo.uiSchema))
})

print()
