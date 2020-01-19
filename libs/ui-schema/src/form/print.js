import fn from '@z1/preset-task'

// schema
import { form } from './main'

// example
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
