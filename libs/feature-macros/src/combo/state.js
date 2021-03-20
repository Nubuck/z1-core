import z from '@z1/lib-feature-box'

// main
export const state = z.fn((t, a) => (cx, settings = {}) => {
  const nextPart = (partAt, part, collection) =>
    t.notNil(t.at(partAt, part))
      ? t.append(t.at(partAt, part), t.at(partAt, collection))
      : t.at(partAt, collection)
  const modalSettings = t.atOr(
    { autoClose: true, skipActive: [] },
    'modal',
    settings
  )

  return (ctx) => {
    const vx = t.reduce(
      (collection, part) => {
        return {
          forms: t.merge(collection.forms, t.atOr({}, 'forms', part)),
          initial: t.mergeDeepRight(
            collection.initial,
            t.atOr({}, 'initial', part)
          ),
          data: {
            before: nextPart('data.before', part, collection),
            after: nextPart('data.after', part, collection),
          },
          load: {
            before: nextPart('load.before', part, collection),
            auto: nextPart('load.auto', part, collection),
            after: nextPart('load.after', part, collection),
          },
          subscribe: nextPart('subscribe', part, collection),
          form: {
            before: nextPart('form.before', part, collection),
            after: nextPart('form.after', part, collection),
          },
          transmit: {
            match: t.mergeDeepRight(
              collection.transmit.match,
              t.atOr({}, 'transmit.match', part)
            ),
            after: nextPart('transmit.after', part, collection),
          },
          extra: t.merge(collection.extra, t.atOr({}, 'extra', part)),
        }
      },
      {
        forms: {},
        initial: {
          data: {},
        },
        data: {
          before: [],
          after: [],
        },
        load: {
          before: [],
          auto: [],
          after: [],
        },
        subscribe: [],
        form: {
          before: [],
          after: [],
        },
        transmit: {
          match: {},
          after: [],
        },
        extra: {},
      },
      t.map(
        (part) => part.state(ctx),
        t.filter((part) => t.notNil(t.at('state', part)), cx)
      )
    )
    return {
      extra: vx.extra,
      initial: ctx.auto.initial(vx.initial.data, vx.forms),
      data(props) {
        const match = t.find(
          (next) => t.notNil(next),
          t.map((cmd) => cmd(props), vx.data.before)
        )

        if (t.notNil(match)) {
          return match
        }
        const result = ctx.auto.data(props)
        if (t.hasLen(vx.data.after)) {
          return t.reduce(
            (collection, cmd) => {
              const next = cmd(props, collection)
              return t.notNil(next) ? next : collection
            },
            result,
            vx.data.after
          )
        }
        return result
      },
      async load(props) {
        if (t.isNil(t.at('params.detail', props))) {
          props.dispatch(props.redirect(props.mutators.routeHome({})))
          return null
        }
        if (t.hasLen(vx.load.before)) {
          let preCollection = null
          await a.map(vx.load.before, 1, async (cmd) => {
            preCollection = await cmd(props, preCollection)
            return null
          })
          if (t.notNil(preCollection)) {
            return preCollection
          }
        }
        const result = await ctx.auto.load(
          t.flatten(t.map((cmd) => cmd(props), vx.load.auto)),
          props
        )
        if (t.hasLen(vx.load.after)) {
          let collection = result
          await a.map(vx.load.after, 1, async (cmd) => {
            collection = await cmd(props, collection)
            return null
          })
          return collection
        }
        return result
      },
      subscribe(props) {
        if (t.noLen(vx.subscribe)) {
          return null
        }
        return ctx.auto.subscribe(
          t.flatten(t.map((cmd) => cmd(props), vx.subscribe))
        )
      },
      form(props) {
        const match = t.find(
          (next) => t.notNil(next),
          t.map((cmd) => cmd(props), vx.form.before)
        )
        if (t.notNil(match)) {
          return match
        }
        const result = ctx.auto.form(vx.forms, props)
        if (t.hasLen(vx.form.after)) {
          return t.reduce(
            (collection, cmd) => {
              const next = cmd(props, collection)
              return t.notNil(next) ? next : collection
            },
            result,
            vx.form.after
          )
        }
        return result
      },
      async transmit(props) {
        const result = await t.runMatch(vx.transmit.match)(
          t.at('next.active', props),
          props
        )
        if (t.hasLen(vx.transmit.after)) {
          let collection = result
          await a.map(vx.transmit.after, 1, async (cmd) => {
            collection = await cmd(props, collection)
            return null
          })
          return collection
        }
        return result
      },
      modal(props) {
        return ctx.auto.modal(modalSettings, props)
      },
      async exit(props) {
        console.log('Exit studio')
      },
    }
  }
})
