import z from '@z1/lib-feature-box'
import sc from '@z1/lib-ui-schema'

// parts
import {
  navMode,
  navStatus,
  navSize,
  calcPrimaryLeft,
  calcSecondaryLeft,
  calcBodyLeft,
  calcBodySpacing,
  calcPageLeft,
} from './parts'

// main
export const nav = z.fn(t =>
  z.state.create('nav', {
    initial: {
      title: '',
      status: navStatus.init,
      mode: navMode.primary,
      level: 'anon',
      schema: {
        anon: {},
        secure: {},
      },
      matched: null,
      width: 0,
      size: 'xs',
      primary: {
        width: navSize.primary,
        items: {},
        actions: {},
        left: 0,
        bottom: 0,
      },
      secondary: {
        width: navSize.secondary,
        items: {},
        left: 0,
        bottom: 0,
      },
      body: {
        height: navSize.body,
        items: {},
        actions: {},
        left: 0,
        navLeft: 0,
        top: 0,
        bottom: 0,
      },
      page: {
        status: navStatus.closed,
        width: navSize.page,
        items: {},
        left: 0,
        top: 0,
        bottom: 0,
      },
    },
    mutations(m) {
      return [
        m('schemaRegister', (state, action) => {
          return t.merge(state, {
            schema: t.merge(state.schema, {
              [action.payload.level]: action.payload.schema,
            }),
          })
        }),
        m('schemaChange', (state, action) => {
          const level = t.pathOr(state.level, ['payload', 'level'], action)
          const schema = t.pathOr(null, ['payload', 'schema'], action)
          return t.merge(state, {
            level,
            schema: t.isNil(schema)
              ? state.schema
              : t.merge(state.schema, {
                  [level]: action.payload.schema,
                }),
          })
        }),
        m('navChange', (state, action) => {
          return state
        }),
        m('navMatch', (state, action) => {
          return state
        }),
        m('navToggle', (state, action) => {
          return state
        }),
      ]
    },
    effects(fx, box) {
      const accountActions = {
        authenticateComplete: 'account/AUTHENTICATE_COMPLETE',
        logout: 'account/LOGOUT',
      }
      return [
        fx(
          [accountActions.authenticateComplete, accountActions.logout],
          (ctx, dispatch, done) => {
            const state = ctx.getState()
            const status = t.pathOr(null, ['account', 'status'], state)
            const level = t.pathOr(null, ['nav', 'level'], state)
            const isSuccess = t.eq(status, 'auth-success')
            const isSecure = t.eq(level, 'secure')
            if (
              t.or(
                t.and(isSecure, isSuccess),
                t.and(t.not(isSecure), t.not(isSuccess))
              )
            ) {
              done()
            } else {
              dispatch(
                box.mutators.schemaChange({
                  level: t.and(t.not(isSecure), isSuccess) ? 'secure' : 'anon',
                })
              )
              done()
            }
          }
        ),
        fx(['screen/RESIZE', box.actions.navToggle], (ctx, dispatch, done) => {
          done()
        }),
        fx(
          [
            t.globrex('*/ROUTING/*').regex,
            z.routing.actions.notFound,
            box.actions.schemaChange,
          ],
          (ctx, dispatch, done) => {
            const state = ctx.getState()
            const level = t.path(['nav', 'level'], state)
            const schema = t.pathOr({}, ['nav', 'schema', level], state)
            const pathname = t.pathOr('', ['location', 'pathname'], state)
            const matched = t.pathOr(null, ['nav', 'matched'], state)
            // find
            const foundNav = sc.nav.find(pathname, schema)
            // validate match
            const checkMatch = t.isNil(foundNav)
              ? t.isNil(matched)
                ? foundNav
                : t.contains(
                    pathname,
                    t.pathOr('', ['nav', 'matched', 'path'], state)
                  )
                ? matched
                : foundNav
              : t.not(foundNav.hasChildren)
              ? t.notNil(matched)
                ? t.contains(pathname, matched.path)
                  ? matched
                  : sc.nav.find(foundNav.parentPath || '', schema)
                : sc.nav.find(foundNav.parentPath || '', schema)
              : nextMatch

            // compute primary
            const primary = t.reduce(
              (data, item) => {
                const isItem = t.eq(
                  t.pathOr('nav', ['options', 'slot'], item),
                  'nav'
                )
                const isAction = t.eq(
                  t.pathOr('nav', ['options', 'slot'], item),
                  'primary-action'
                )
                return t.merge(data, {
                  items: t.or(t.not(isItem), isAction)
                    ? data.items
                    : t.not(isItem)
                    ? data.items
                    : t.concat(data.items, [item]),
                  actions: t.not(isAction)
                    ? data.actions
                    : t.concat(data.actions, [item]),
                })
              },
              { items: [], actions: [] },
              t.values(schema)
            )

            console.log('primary', primary)

            const validMatch = t.notZeroLen(primary.items)
              ? t.isNil(checkMatch)
                ? checkMatch
                : t.not(
                    t.eq(
                      'nav',
                      t.pathOr('nav', ['options', 'slot'], checkMatch)
                    )
                  )
                ? t.or(
                    t.not(checkMatch.hasChildren),
                    t.isZeroLen(
                      t.filter(
                        item =>
                          t.eq(
                            'nav',
                            t.pathOr('nav', ['options', 'slot'], item)
                          ),
                        t.values(checkMatch.children || [])
                      )
                    )
                  )
                  ? sc.nav.find(checkMatch.parentPath || '', schema)
                  : checkMatch
                : checkMatch
              : checkMatch

              console.log('validMatch', validMatch)

            const secondary = t.isZeroLen(primary.items)
              ? { items: [], bodyItems: [], bodyActions: [] }
              : t.reduce(
                  (data, item) => {
                    const isBodyItem = t.eq(
                      t.pathOr('nav', ['options','slot'], item),
                      'body'
                    )
                    const isBodyAction = t.eq(
                      t.pathOr('nav', ['options','slot'], item),
                      'body-action'
                    )
                    return t.merge(data, {
                      items: t.or(isBodyItem, isBodyAction)
                        ? data.items
                        : t.concat(data.items, [item]),
                      bodyItems: t.not(isBodyItem)
                        ? data.bodyItems
                        : t.concat(data.bodyItems, [item]),
                      bodyActions: t.not(isBodyAction)
                        ? data.bodyActions
                        : t.concat(data.bodyActions, [item]),
                    })
                  },
                  { items: [], bodyItems: [], bodyActions: [] },
                  t.isNil(validMatch) ? [] : validMatch.children
                )

            done()
          }
        ),
      ]
    },
    afterInit(ctx) {
      ctx.dispatch(ctx.mutators.schemaChange({}))
    },
  })
)
