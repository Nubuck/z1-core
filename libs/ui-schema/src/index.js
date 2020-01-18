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
  prop: {
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

const field = fn(t => (nameOrProps, propsOrChildren, otherChildren) => {
  const name = t.isType(nameOrProps, 'string') ? nameOrProps : 'root'
  const props = t.eq(name, 'root') ? nameOrProps : propsOrChildren
  const children = t.eq(name, 'root') ? propsOrChildren : otherChildren
  const fieldKey = t.to.camelCase(name)
  const nextProps = t.omit(['ui', 'required'], props)
  const nextRequired = t.pathOr(false, ['required'], props)
  if (t.neq(name, 'root')) {
    if (t.includes(nextProps.type, ['object', 'array'])) {
      const childKey = t.match({
        object: 'properties',
        array: 'items',
      })(nextProps.type)
      return ctx => {
        const next = t.reduce(
          (cx, ff) => ff(cx),
          { props: {}, ui: t.pathOr({}, ['ui'], props), required: [] },
          children || []
        )
        const itemKey = t.eq(childKey, 'items')
          ? t.head(t.keys(next.props))
          : ''
        return {
          props: t.merge(t.pathOr({}, ['props'], ctx), {
            [fieldKey]: t.merge(nextProps, {
              required: next.required,
              [childKey]: t.eq(childKey, 'items')
                ? t.pathOr({}, [itemKey], next.props)
                : next.props,
            }),
          }),
          ui: t.merge(t.pathOr({}, ['ui'], ctx), {
            [fieldKey]: t.eq(childKey, 'items')
              ? { items: t.pathOr({}, [itemKey], next.ui) }
              : next.ui,
          }),
          required: t.eq(nextRequired, true)
            ? t.concat(t.pathOr([], ['required'], ctx), [fieldKey])
            : t.pathOr([], ['required'], ctx),
        }
      }
    }
    return ctx => {
      return {
        props: t.merge(t.pathOr({}, ['props'], ctx), {
          [fieldKey]: nextProps,
        }),
        ui: t.merge(t.pathOr({}, ['ui'], ctx), {
          [fieldKey]: t.pathOr({}, ['ui'], props),
        }),
        required: t.eq(nextRequired, true)
          ? t.concat(t.pathOr([], ['required'], ctx), [fieldKey])
          : t.pathOr([], ['required'], ctx),
      }
    }
  }
  const next = t.reduce(
    (ctx, ff) => ff(ctx),
    { props: {}, ui: t.pathOr({}, ['ui'], props), required: [] },
    children || []
  )
  return {
    schema: t.merge(nextProps, {
      required: next.required,
      [keys.prop.props]: next.props,
    }),
    uiSchema: next.ui,
  }
})

const form = fn(t => factory => {
  const result = factory(field, keys)
  return result
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
      f('itemName', {
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
      f('obj', { type: k.object }, [
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
  ])
)

const print = fn(t => () => {
  console.log('DEMO SCHEMA', t.omit(['properties'], demo.schema))
  t.forEach(key => {
    console.log('SCHEMA PROP', key, demo.schema.properties[key])
  }, t.keys(demo.schema.properties))
  t.forEach(key => {
    console.log('UI SCHEMA PROP', key, demo.uiSchema[key])
  }, t.keys(demo.uiSchema))
})

print()
