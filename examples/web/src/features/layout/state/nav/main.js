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
  slotPath,
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
          const level = t.atOr(state.level, 'payload.level', action)
          const schema = t.atOr(null, 'payload.schema', action)
          return t.merge(state, {
            status: 'ready',
            level,
            schema: t.isNil(schema)
              ? state.schema
              : t.merge(state.schema, {
                  [level]: action.payload.schema,
                }),
          })
        }),
        m('navChange', (state, action) => {
          if (t.isEmpty(action.payload)) {
            return state
          }
          const status = t.atOr('ready', 'payload.status', action)
          const bodyHeight = t.atOr(
            state.body.height,
            'payload.height',
            action
          )
          const size = t.atOr(state.size, 'payload.size', action)
          const width = t.atOr(state.width, 'payload.width', action)
          const secondaryItems = t.atOr({}, 'secondary.items', state)
          const pageItems = t.atOr({}, 'page.items', state)
          const bodyItems = t.atOr({}, 'body.items', state)
          const bodyActions = t.atOr({}, 'body.actions', state)
          const body = t.merge(bodyItems, bodyActions)
          const pageStatus = t.atOr(
            state.page.status,
            'payload.pageStatus',
            action
          )
          const bottom = calcBodySpacing('bottom', body, size, bodyHeight)
          const top = calcBodySpacing('top', body, size, bodyHeight)
          return t.merge(state, {
            status,
            width,
            size,
            title: t.atOr(state.title, 'payload.title', action),
            mode: t.atOr(state.mode, 'payload.mode', action),
            primary: t.merge(state.primary, {
              left: calcPrimaryLeft(
                status,
                t.merge(state.primary.items, state.primary.actions)
              ),
              bottom,
            }),
            secondary: t.merge(state.secondary, {
              left: calcSecondaryLeft(status, secondaryItems),
              bottom,
            }),
            body: t.merge(state.body, {
              height: bodyHeight,
              left: calcBodyLeft(status, size, width, t.notEmpty(pageItems)),
              navLeft: calcBodyLeft(status, size, width),
              top,
              bottom,
            }),
            page: t.merge(state.page, {
              status: pageStatus,
              left: calcPageLeft(status, size, width, pageStatus),
              top,
              bottom,
            }),
          })
        }),
        m('navMatch', (state, action) => {
          const width = t.atOr(state.width, 'payload.width', action)
          const primaryItems = t.atOr(
            state.primary.items,
            'payload.primary.items',
            action
          )
          const primaryActions = t.atOr(
            state.primary.actions,
            'payload.primary.actions',
            action
          )
          const secondaryItems = t.atOr(
            state.secondary.items,
            'payload.secondary.items',
            action
          )
          const bodyItems = t.atOr(
            state.body.items,
            'payload.body.items',
            action
          )
          const bodyActions = t.atOr(
            state.body.actions,
            'payload.body.actions',
            action
          )
          const body = t.merge(bodyItems, bodyActions)
          const pageItems = t.atOr(
            state.page.items,
            'payload.page.items',
            action
          )
          const pageStatus = t.isEmpty(pageItems) ? 'closed' : state.page.status
          const bottom = calcBodySpacing(
            'bottom',
            body,
            state.size,
            state.body.height
          )
          const top = calcBodySpacing(
            'top',
            body,
            state.size,
            state.body.height
          )
          return t.merge(state, {
            width,
            title: t.atOr(state.title, 'payload.title', action),
            mode: t.atOr(state.mode, 'payload.mode', action),
            matched: t.atOr(state.matched, 'payload.matched', action),
            primary: t.merge(state.primary, {
              left: calcPrimaryLeft(
                state.status,
                t.merge(primaryItems, primaryActions)
              ),
              bottom,
              items: primaryItems,
              actions: primaryActions,
            }),
            secondary: t.merge(state.secondary, {
              left: calcSecondaryLeft(state.status, secondaryItems),
              bottom,
              items: secondaryItems,
            }),
            body: t.merge(state.body, {
              left: calcBodyLeft(
                state.status,
                state.size,
                width,
                t.notEmpty(pageItems)
              ),
              navLeft: calcBodyLeft(state.status, state.size, width),
              top,
              bottom,
              items: bodyItems,
              actions: t.atOr(
                state.body.actions,
                'payload.body.actions',
                action
              ),
            }),
            page: t.merge(state.page, {
              status: pageStatus,
              left: calcPageLeft(state.status, state.size, width, pageStatus),
              top,
              bottom,
              items: pageItems,
            }),
          })
        }),
        m('navToggle', (state, action) => {
          const slot = t.atOr('nav', 'payload.slot', action)
          const status = t.eq('nav', slot)
            ? t.eq(state.status, 'open')
              ? 'closed'
              : 'open'
            : state.status
          const pageStatus = t.neq('nav', slot)
            ? t.eq(state.page.status, 'open')
              ? 'closed'
              : 'open'
            : t.eq(status, 'open')
            ? 'closed'
            : state.page.status
          const nextStatus = t.and(t.neq('nav', slot), t.eq(pageStatus, 'open'))
            ? 'closed'
            : status
          const pageItems = t.atOr({}, 'page.items', state)
          const body = t.merge(state.body.items, state.body.actions)
          const bottom = calcBodySpacing(
            'bottom',
            body,
            state.size,
            state.body.height
          )
          const top = calcBodySpacing(
            'top',
            body,
            state.size,
            state.body.height
          )
          return t.merge(state, {
            status: nextStatus,
            primary: t.merge(state.primary, {
              left: calcPrimaryLeft(
                nextStatus,
                t.merge(state.primary.items, state.primary.actions)
              ),
              bottom,
            }),
            secondary: t.merge(state.secondary, {
              left: calcSecondaryLeft(nextStatus, state.secondary.items),
              bottom,
            }),
            body: t.merge(state.body, {
              left: calcBodyLeft(
                nextStatus,
                state.size,
                state.width,
                t.notEmpty(pageItems)
              ),
              navLeft: calcBodyLeft(nextStatus, state.size, state.width),
              top,
              bottom,
            }),
            page: t.merge(state.page, {
              status: pageStatus,
              left: calcPageLeft(
                nextStatus,
                state.size,
                state.width,
                pageStatus
              ),
              top,
              bottom,
            }),
          })
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
            const status = t.atOr(null, 'account.authStatus', state)
            const level = t.atOr(null, 'nav.level', state)
            const isSuccess = t.eq(status, 'auth-success')
            const isSecure = t.eq(level, 'secure')
            const nextLevel = t.and(t.not(isSecure), isSuccess)
              ? 'secure'
              : 'anon'
            if (
              t.anyOf([
                t.and(isSecure, isSuccess),
                t.and(t.not(isSecure), t.not(isSuccess)),
                t.eq(level, nextLevel),
              ])
            ) {
              done()
            } else {
              dispatch(
                box.mutators.schemaChange({
                  level: nextLevel,
                })
              )
              done()
            }
          }
        ),
        fx(['screen/RESIZE', box.actions.navToggle], (ctx, dispatch, done) => {
          const state = ctx.getState()
          const status = t.atOr(null, 'nav.status', state)
          const size = t.atOr('xs', 'screen.size', state)
          const currentNavSize = t.atOr('xs', 'nav.size', state)
          const nextStatus = t.not(t.or(t.eq(size, 'lg'), t.eq(size, 'xl')))
            ? t.eq(status, navStatus.init)
              ? navStatus.closed
              : status
            : navStatus.ready
          if (t.or(t.neq(status, nextStatus), t.neq(size, currentNavSize))) {
            dispatch(
              box.mutations.navChange({
                height: t.not(t.or(t.eq(size, 'lg'), t.eq(size, 'xl')))
                  ? navSize.bodySm
                  : navSize.body,
                status: nextStatus,
                pageSize: nextStatus,
                size,
              })
            )
          }
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
            const status = t.at('nav.status', state)
            if (t.eq(status, navStatus.init)) {
              done()
            } else {
              const level = t.at('nav.level', state)
              const schema = t.pathOr({}, ['nav', 'schema', level], state)
              const pathname = t.atOr('', 'location.pathname', state)
              const matched = t.atOr(null, 'nav.matched', state)
              // find
              const foundNav = sc.nav.find(pathname, schema)
              // validate match
              const checkMatch = t.isNil(foundNav)
                ? t.isNil(matched)
                  ? foundNav
                  : t.contains(
                      pathname,
                      t.atOr('', 'nav.matched.path', state)
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
                (data, [key, item]) => {
                  const isItem = t.eq(slotPath(item), 'nav')
                  const isAction = t.eq(slotPath(item), 'primary-action')
                  return t.merge(data, {
                    items: t.or(t.not(isItem), isAction)
                      ? data.items
                      : t.not(isItem)
                      ? data.items
                      : t.merge(data.items, { [key]: item }),
                    actions: t.not(isAction)
                      ? data.actions
                      : t.merge(data.actions, { [key]: item }),
                  })
                },
                { items: {}, actions: {} },
                t.to.pairs(schema)
              )

              const validMatch = t.notZeroLen(primary.items)
                ? t.isNil(checkMatch)
                  ? checkMatch
                  : t.neq('nav', slotPath(checkMatch))
                  ? t.or(
                      t.not(checkMatch.hasChildren),
                      t.isZeroLen(
                        t.filter(
                          item => t.eq('nav', slotPath(item)),
                          t.values(checkMatch.children || [])
                        )
                      )
                    )
                    ? sc.nav.find(checkMatch.parentPath || '', schema)
                    : checkMatch
                  : checkMatch
                : checkMatch

              const secondary = t.isEmpty(primary.items)
                ? { items: {}, bodyItems: {}, bodyActions: {} }
                : t.reduce(
                    (data, [key, item]) => {
                      const isBodyItem = t.eq(slotPath(item), 'body')
                      const isBodyAction = t.eq(slotPath(item), 'body-action')
                      return t.merge(data, {
                        items: t.or(isBodyItem, isBodyAction)
                          ? data.items
                          : t.merge(data.items, { [key]: item }),
                        bodyItems: t.not(isBodyItem)
                          ? data.bodyItems
                          : t.merge(data.bodyItems, { [key]: item }),
                        bodyActions: t.not(isBodyAction)
                          ? data.bodyActions
                          : t.merge(data.bodyActions, { [key]: item }),
                      })
                    },
                    { items: {}, bodyItems: {}, bodyActions: {} },
                    t.isNil(validMatch) ? [] : t.to.pairs(validMatch.children)
                  )

              const nextMode = t.isEmpty(
                t.merge(primary.items, primary.actions)
              )
                ? navMode.page
                : t.isNil(validMatch)
                ? navMode.primary
                : t.isEmpty(secondary.items)
                ? navMode.primary
                : navMode.secondary

              const nextBody = t.neq(nextMode, navMode.page)
                ? {
                    items: secondary.bodyItems,
                    actions: secondary.bodyActions,
                  }
                : t.reduce(
                    (data, [key, item]) => {
                      const isBodyItem = t.eq(slotPath(item), 'body')
                      const isBodyAction = t.eq(slotPath(item), 'body-action')
                      return t.merge(data, {
                        items: t.not(isBodyItem)
                          ? data.items
                          : t.merge(data.items, { [key]: item }),
                        actions: t.not(isBodyAction)
                          ? data.actions
                          : t.merge(data.actions, { [key]: item }),
                      })
                    },
                    { items: {}, actions: {} },
                    t.to.pairs(schema)
                  )

              // page items
              const matchedBodyItem = t.neq(nextMode, navMode.page)
                ? t.find(
                    item => t.eq(pathname, item.path),
                    t.values(nextBody.items) || []
                  )
                : validMatch

              const checkBodyItem = t.neq(nextMode, navMode.page)
                ? t.and(t.isNil(matchedBodyItem), t.notEmpty(nextBody.items))
                  ? sc.nav.find(pathname, nextBody.items)
                  : matchedBodyItem
                : validMatch

              const finalBodyItem = t.and(
                t.notEmpty(nextBody.items),
                t.and(t.isNil(matchedBodyItem), t.notNil(checkBodyItem))
              )
                ? t.eq(checkBodyItem.path, pathname)
                  ? sc.nav.find(checkBodyItem.parentPath || '', schema)
                  : matchedBodyItem
                : matchedBodyItem

              const pageItems = t.isNil(finalBodyItem)
                ? {}
                : t.notEmpty(t.atOr({}, 'children', finalBodyItem))
                ? finalBodyItem.children
                : {}

              const nextSecondaryItems = t.eq(nextMode, navMode.page)
                ? secondary.items
                : t.and(
                    t.notEmpty(nextBody.items || {}),
                    t.isEmpty(secondary.items)
                  )
                ? t.fromPairs(
                    t.filter(
                      ([key, item]) => t.eq('nav', slotPath(item)),
                      t.to.pairs(
                        t.atOr(
                          {},
                          'children',
                          sc.nav.find(validMatch.parentPath || '', schema) || {}
                        )
                      )
                    )
                  )
                : secondary.items

              const finalMode = t.eq(nextMode, navMode.page)
                ? nextMode
                : t.isNil(validMatch)
                ? navMode.primary
                : t.isEmpty(nextSecondaryItems)
                ? navMode.primary
                : navMode.secondary

              // mutate
              dispatch(
                box.mutators.navMatch({
                  matched: validMatch,
                  mode: finalMode,
                  title: t.isNil(validMatch)
                    ? t.atOr('', 'nav.text', state)
                    : validMatch.options.text,
                  width:
                    t.getMatch(finalMode)({
                      [navMode.page]: 0,
                      [navMode.primary]: navSize.primary,
                      [navMode.secondary]: navSize.primary + navSize.secondary,
                    }) || 0,
                  primary,
                  secondary: { items: nextSecondaryItems },
                  body: nextBody,
                  page: {
                    items: pageItems,
                  },
                })
              )

              // finally
              done()
            }
          },
          { latest: true }
        ),
      ]
    },
    afterInit(ctx) {
      ctx.dispatch(ctx.mutators.schemaChange({}))
    },
  })
)
