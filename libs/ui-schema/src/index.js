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
  const next = {
    key: fieldKey,
    props: nextProps,
    ui: t.pathOr({}, ['ui'], props),
    required: t.pathOr(false, ['required'], props),
    // children,
    children: t.allOf([
      t.includes(nextProps.type, ['object', 'array']),
      t.notZeroLen(children),
    ])
      ? t.mergeAll(children)
      : undefined,
  }
  return t.eq(name, 'root')
    ? next
    : {
        [fieldKey]: next,
      }
})

// const toSchema = fn(t =>
//   t.trampoline(function render(def) {
//   })
// )

const toSchema = fn(t => function render(def, ui, required) {
  if (t.eq(def.key, 'root')) {
    
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
  ])
)

console.log('DEMO FORM', demo, demo.children)
