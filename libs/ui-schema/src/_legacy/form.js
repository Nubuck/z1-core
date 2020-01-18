import { task } from '@z1/preset-task'
import { camelKeys, tailHead } from './common'

// form types
const SCALAR = {
  ARRAY: 'array',
  NUMBER: 'number',
  INT: 'integer',
  OBJECT: 'object',
  STRING: 'string',
  BOOL: 'boolean',
  NULL: 'null',
}
const FORM_SCHEMA = task(t =>
  t.mergeDeepRight(SCALAR, {
    KEY: {
      TITLE: 'title',
      DESC: 'description',
      TYPE: 'type',
      FORMAT: 'format',
      REQUIRED: 'required',
      PROPS: 'properties',
      ITEMS: 'items',
      ENUM: 'enum',
      ENUM_NAMES: 'enumNames',
      UNIQUE: 'uniqueNames',
      UNIQUE_ITEMS: 'uniqueItems',
      DEFAULT: 'default',
      ANY_OF: 'anyOf',
      ONE_OF: 'oneOf',
    },
    UI: {
      WIDGET: 'ui:widget',
      FIELD: 'ui:field',
      ORDER: 'ui:order',
      PLACEHOLDER: 'ui:placeholder',
      DISABLED: 'ui:disabled',
      CSS: 'classNames',
      ROOT_FIELD_ID: 'rootFieldId',
      OPTIONS: 'ui:options',
    },
    FORMAT: {
      EMAIL: 'email',
      URL: 'uri',
      DATA_URL: 'data-url',
      DATE: 'date',
      DATE_TIME: 'date-time',
      ALT_DATE: 'alt-date',
      ALT_DATE_TIME: 'alt-datetime',
    },
    WIDGET: {
      RADIO: 'radio',
      CHECKBOXES: 'checkboxes',
      SELECT: 'select',
      TEXT_AREA: 'textarea',
      PASSWORD: 'password',
      COLOR: 'color',
      EMAIL: 'email',
      URL: 'uri',
      FILE: 'data-url',
      DATE: 'date',
      DATE_TIME: 'date-time',
      ALT_DATE: 'alt-date',
      ALT_DATE_TIME: 'alt-datetime',
      UP_DOWN: 'updown',
      RANGE: 'range',
      DISABLED: 'disabled',
      READ_ONLY: 'readonly',
      HIDDEN: 'hidden',
      HELP: 'help',
      NUMBER: 'number',
    },
  })
)

// form tasks
const jsonSchemaFromFieldList = task(t =>
  t.compose(
    t.fromPairs,
    t.map(item => [t.path(['name'], item), t.path(['schema'], item)])
  )
)
const uiSchemaFromUiList = task(t => (itemOrItems, collection = {}) => {
  if (t.eq(t.type(itemOrItems), 'Array')) {
    if (t.eq(t.length(itemOrItems), 0)) {
      return collection
    }
    const itemHead = t.head(itemOrItems)
    if (t.eq(t.length(itemOrItems), 1)) {
      return t.merge(collection, itemHead)
    }
    return uiSchemaFromUiList(
      t.tail(itemOrItems),
      t.merge(collection, itemHead)
    )
  }
  if (t.eq(t.type(itemOrItems), 'Object')) {
    return t.merge(collection, itemOrItems)
  }
  return collection
})
const uiSchemaFromFieldList = task(t => list => {
  const uiList = t.filter(item => t.has('uiSchema')(item), list)
  const uiSchemaList = t.map(item => {
    const ui = t.path(['uiSchema'], item)
    return t.gt(t.length(t.keys(ui)), 1)
      ? t.fromPairs(t.map(key => [key, t.path([key], ui)], t.keys(ui)))
      : ui
  }, uiList)
  return uiSchemaFromUiList(uiSchemaList)
})
const requiredFromSchema = task(t => schema =>
  t.compose(
    t.map(item => item.key),
    t.filter(item => item.required),
    t.map(([key, value]) => {
      return {
        key,
        required: t.not(t.has('required')(value))
          ? false
          : t.eq('Array', t.type(value.required))
          ? false
          : value.required,
      }
    })
  )(t.toPairs(schema || {}) || [])
)
const correctSchemaFields = task(t => schema =>
  t.compose(
    t.fromPairs,
    t.map(([key, value]) =>
      t.not(t.has('required')(value))
        ? [key, value]
        : [key, t.omit(['required'], value)]
    )
  )(t.toPairs(schema || {}) || [])
)
const jsonField = task(t => (name, field, children) => {
  const fieldKeys = camelKeys(FORM_SCHEMA.KEY)
  const fieldList = t.toPairs(field)
  const fieldSchema = t.fromPairs(
    t.filter(
      field =>
        t.gt(t.findIndex(key => t.eq(t.head(field), key), fieldKeys), -1),
      fieldList
    )
  )
  const uiSchemaList = t.head(
    t.filter(field => t.eq(t.head(field), 'ui'), fieldList)
  )
  const uiSchema = t.gt(t.length(uiSchemaList), 0)
    ? t.fromPairs(
        t.filter(
          field =>
            t.and(
              t.not(t.eq(t.head(field), 'undefined')),
              t.not(t.isNil(t.head(field)))
            ),
          t.map(
            field => [t.head(field), tailHead(field)],
            t.toPairs(tailHead(uiSchemaList))
          )
        )
      )
    : {}
  const propChildKey = t.path(['childKey'], field)
  // fields can only be string, object and array
  // objects and arrays must have children
  // only objects have the required field
  const nextFieldType = t.not(
    t.isEmpty(t.path([FORM_SCHEMA.KEY.TYPE], fieldSchema))
  )
    ? t.path([FORM_SCHEMA.KEY.TYPE], fieldSchema)
    : t.and(t.not(t.isEmpty(children)), t.not(t.isNil(children)))
    ? t.eq(t.length(children), 1)
      ? FORM_SCHEMA.ARRAY
      : FORM_SCHEMA.OBJECT
    : FORM_SCHEMA.STRING
  // objects have props and arrays have items
  const childKey = t.and(t.not(t.isEmpty(children)), t.not(t.isNil(children)))
    ? t.eq(nextFieldType, FORM_SCHEMA.OBJECT)
      ? FORM_SCHEMA.KEY.PROPS
      : FORM_SCHEMA.KEY.ITEMS
    : ''
  const nextChildren = t.isEmpty(childKey)
    ? {}
    : jsonSchemaFromFieldList(children)
  // modify object field schema to include required fields
  const nextFieldSchema = t.eq(FORM_SCHEMA.OBJECT, nextFieldType)
    ? t.merge(fieldSchema, { required: requiredFromSchema(nextChildren) })
    : fieldSchema
  // schema mutation
  const nextSchema = t.isEmpty(childKey)
    ? t.merge(nextFieldSchema, { type: nextFieldType })
    : t.not(propChildKey)
    ? t.merge(nextFieldSchema, {
        type: nextFieldType,
        [childKey]: t.eq(childKey, FORM_SCHEMA.KEY.ITEMS)
          ? correctSchemaFields(nextChildren)[t.head(t.keys(nextChildren))]
          : correctSchemaFields(nextChildren),
      })
    : t.merge(nextFieldSchema, {
        type: nextFieldType,
        [propChildKey]: t.map(
          ([_, val]) => val,
          t.toPairs(correctSchemaFields(nextChildren))
        ),
      })
  // children ui schema
  const nextChildUiSchema = t.gt(t.length(children), 0)
    ? uiSchemaFromFieldList(children)
    : {}
  // ui schema mutation
  const nextUiSchema = t.and(
    t.not(t.isEmpty(uiSchema)),
    t.not(t.isNil(uiSchema))
  )
    ? t.eq(nextSchema.type, 'object')
      ? {
          [name]: t.merge(uiSchema, nextChildUiSchema),
        }
      : t.eq(nextSchema.type, 'array')
      ? {
          [name]: t.merge(uiSchema, { items: nextChildUiSchema }),
        }
      : t.merge(
          {
            [name]: uiSchema,
          },
          nextChildUiSchema
        )
    : t.gt(t.length(t.keys(nextChildUiSchema)), 0)
    ? t.eq(nextSchema.type, 'object')
      ? {
          [name]: nextChildUiSchema,
        }
      : t.eq(nextSchema.type, 'array')
      ? {
          [name]: { items: nextChildUiSchema },
        }
      : nextChildUiSchema
    : {}
  // yield
  return {
    name,
    schema: nextSchema,
    uiSchema: nextUiSchema,
  }
})

// exports
export const formSchema = task(t => factory => {
  const fieldListOrRootField = factory(jsonField, FORM_SCHEMA)
  const fieldList = t.eq(t.type(fieldListOrRootField), 'Array')
    ? fieldListOrRootField
    : [fieldListOrRootField]
  const schema = jsonSchemaFromFieldList(fieldList)
  const schemaKeys = t.keys(schema)
  const nextSchema = t.eq(t.length(schemaKeys), 1)
    ? t.path(schemaKeys, schema)
    : schema
  const uiSchema = uiSchemaFromFieldList(fieldList)
  const uiSchemaKeys = t.keys(uiSchema)
  const nextUiSchema = t.and(
    t.eq(t.length(uiSchemaKeys), 1),
    t.eq(t.head(schemaKeys), t.head(uiSchemaKeys))
  )
    ? t.path(uiSchemaKeys, uiSchema)
    : uiSchema

  return {
    schema: nextSchema,
    uiSchema: nextUiSchema,
  }
})
