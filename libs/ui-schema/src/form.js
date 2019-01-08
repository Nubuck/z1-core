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
export const FORM_SCHEMA = task(
  t => t.mergeDeepRight(SCALAR, {
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
  }),
)

// form tasks
const jsonSchemaFromFieldList = task(
  t => t.compose(
    t.fromPairs,
    t.map(
      item => [
        t.path([ 'name' ], item),
        t.path([ 'schema' ], item),
      ],
    ),
  ),
)
const uiSchemaFromUiList = task(
  t => (itemOrItems, collection = {}) => {
    if (t.equals(t.type(itemOrItems), 'Array')) {
      if (t.equals(t.length(itemOrItems), 0)) {
        return collection
      }
      const itemHead = t.head(itemOrItems)
      if (t.equals(t.length(itemOrItems), 1)) {
        return t.merge(collection, itemHead)
      }
      return uiSchemaFromUiList(
        t.tail(itemOrItems),
        t.merge(collection, itemHead),
      )
    }
    if (t.equals(t.type(itemOrItems), 'Object')) {
      return t.merge(collection, itemOrItems)
    }
    return collection
  },
)
const uiSchemaFromFieldList = task(
  t => list => {
    const uiList = t.filter(
      item => t.has('uiSchema')(item),
      list,
    )
    const uiSchemaList = t.map(
      item => {
        const ui = t.path([ 'uiSchema' ], item)
        return t.gt(t.length(t.keys(ui)), 1)
          ? t.fromPairs(
            t.map(
              key => [ key, t.path([ key ], ui) ],
              t.keys(ui),
            ),
          )
          : ui
      },
      uiList,
    )
    return uiSchemaFromUiList(uiSchemaList)
  },
)
const requiredFromSchema = task(
  t => schema => t.compose(
    t.map(item => item.key),
    t.filter(item => item.required),
    t.map(([ key, value ]) => {
      return {
        key,
        required: !t.has('required')(value)
          ? false
          : t.eq('Array', t.type(value.required))
            ? false
            : value.required,
      }
    }),
  )(t.toPairs(schema || {}) || []),
)
const correctSchemaFields = task(
  t => schema => t.compose(
    t.fromPairs,
    t.map(
      ([ key, value ]) => !t.has('required')(value)
        ? [ key, value ]
        : [ key, t.omit([ 'required' ], value) ],
    ),
  )(t.toPairs(schema || {}) || []),
)
const jsonField = task(
  t => (name, field, children) => {
    const fieldKeys = camelKeys(FORM_SCHEMA.KEY)
    const fieldList = t.toPairs(field)
    const fieldSchema = t.fromPairs(
      t.filter(
        field => t.gt(
          t.findIndex(
            key => t.equals(t.head(field), key),
            fieldKeys,
          ),
          -1,
        ),
        fieldList,
      ),
    )
    const uiSchemaList = t.head(
      t.filter(
        field => t.equals(t.head(field), 'ui'),
        fieldList,
      ),
    )
    const uiSchema = t.gt(t.length(uiSchemaList), 0)
      ? t.fromPairs(
        t.filter(
          field => !t.equals(t.head(field), 'undefined')
            && !t.isNil(t.head(field)),
          t.map(
            field => [ t.head(field), tailHead(field) ],
            t.toPairs(tailHead(uiSchemaList)),
          ),
        ),
      )
      : {}
    // fields can only be string, object and array
    // objects and arrays must have children
    // only objects have the required field
    const nextFieldType = !t.isEmpty(t.path([ FORM_SCHEMA.KEY.TYPE ], fieldSchema))
      ? t.path([ FORM_SCHEMA.KEY.TYPE ], fieldSchema)
      : !t.isEmpty(children) && !t.isNil(children)
        ? t.equals(t.length(children), 1)
          ? FORM_SCHEMA.ARRAY
          : FORM_SCHEMA.OBJECT
        : FORM_SCHEMA.STRING
    // objects have props and arrays have items
    const childKey = !t.isEmpty(children) && !t.isNil(children)
      ? t.equals(nextFieldType, FORM_SCHEMA.OBJECT)
        ? FORM_SCHEMA.KEY.PROPS
        : FORM_SCHEMA.KEY.ITEMS
      : ''
    const nextChildren = t.isEmpty(childKey)
      ? {}
      : jsonSchemaFromFieldList(children)
    // modify object field schema to include required fields
    const nextFieldSchema = t.equals(FORM_SCHEMA.OBJECT, nextFieldType)
      ? t.merge(
        fieldSchema,
        { required: requiredFromSchema(nextChildren) },
      )
      : fieldSchema
    // schema mutation
    const nextSchema = t.isEmpty(childKey)
      ? t.merge(nextFieldSchema, { type: nextFieldType })
      : t.merge(
        nextFieldSchema,
        {
          type: nextFieldType,
          [childKey]: correctSchemaFields(nextChildren),
        },
      )
    // ui schema mutation
    const nextUiSchema = !t.isEmpty(uiSchema)
    && !t.isNil(uiSchema)
      ? t.gt(t.length(children), 0)
        ? t.merge(
          {
            [name]: uiSchema,
          },
          uiSchemaFromFieldList(children),
        )
        : { [name]: uiSchema }
      : t.gt(t.length(children), 0)
        ? uiSchemaFromFieldList(children)
        : {}
    // yield
    return {
      name,
      schema: nextSchema,
      uiSchema: nextUiSchema,
    }
  },
)
// const withRequiredFields = task(
//   t => schema => {
//     return {}
//   }
// )
// exports
export const formSchema = task(
  t => factory => {
    const fieldListOrRootField = factory(jsonField, FORM_SCHEMA)
    const fieldList = t.equals(t.type(fieldListOrRootField), 'Array')
      ? fieldListOrRootField
      : [ fieldListOrRootField ]
    const schema = jsonSchemaFromFieldList(fieldList)
    const schemaKeys = t.keys(schema)
    const nextSchema = t.equals(t.length(schemaKeys), 1)
      ? t.path(schemaKeys, schema)
      : schema
    const uiSchema = uiSchemaFromFieldList(fieldList)
    return {
      schema: nextSchema,
      uiSchema,
    }
  },
)