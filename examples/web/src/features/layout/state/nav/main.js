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
          if (t.isEmpty(action.payload)) {
            return state
          }
          const status = t.pathOr(state.status, ['payload', 'status'], action)
          const bodyHeight = t.pathOr(
            state.body.height,
            ['payload', 'height'],
            action
          )
          const size = t.pathOr(state.size, ['payload', 'size'], action)
          const width = t.pathOr(state.width, ['payload', 'width'], action)
          const secondaryItems = t.pathOr({}, ['secondary', 'items'], state)
          const pageItems = t.pathOr({}, ['page', 'items'], state)
          const bodyItems = t.pathOr({}, ['body', 'items'], state)
          const bodyActions = t.pathOr({}, ['body', 'actions'], state)
          const body = t.merge(bodyItems, bodyActions)
          const pageStatus = t.pathOr(
            state.page.status,
            ['payload', 'pageStatus'],
            action
          )
          const bottom = calcBodySpacing('bottom', body, size, bodyHeight)
          const top = calcBodySpacing('top', body, size, bodyHeight)
          return t.merge(state, {
            status,
            width,
            size,
            title: t.pathOr(state.title, ['payload', 'title'], action),
            mode: t.pathOr(state.mode, ['payload', 'mode'], action),
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
          const width = t.pathOr(state.width, ['payload', 'width'], action)
          const primaryItems = t.pathOr(
            state.primary.items,
            ['payload', 'primary', 'items'],
            action
          )
          const primaryActions = t.pathOr(
            state.primary.actions,
            ['payload', 'primary', 'actions'],
            action
          )
          const secondaryItems = t.pathOr(
            state.secondary.items,
            ['payload', 'secondary', 'items'],
            action
          )
          const bodyItems = t.pathOr(
            state.body.items,
            ['payload', 'body', 'items'],
            action
          )
          const bodyActions = t.pathOr(
            state.body.actions,
            ['payload', 'body', 'actions'],
            action
          )
          const body = t.merge(bodyItems, bodyActions)
          const pageItems = t.pathOr(
            state.page.items,
            ['payload', 'page', 'items'],
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
            title: t.pathOr(state.title, ['payload', 'title'], action),
            mode: t.pathOr(state.mode, ['payload', 'mode'], action),
            matched: t.pathOr(state.matched, ['payload', 'matched'], action),
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
              actions: t.pathOr(
                state.body.actions,
                ['payload', 'body', 'actions'],
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
          const slot = t.pathOr('nav', ['payload', 'slot'], action)
          const status = t.eq('nav', target)
            ? t.eq(state.status, 'open')
              ? 'closed'
              : 'open'
            : state.status
          const pageStatus = t.neq('nav', target)
            ? t.eq(state.page.status, 'open')
              ? 'closed'
              : 'open'
            : t.eq(status, 'open')
            ? 'closed'
            : state.page.status
          const nextStatus = t.and(
            t.neq('nav', target),
            t.eq(pageStatus, 'open')
          )
            ? 'closed'
            : status
          const pageItems = t.pathOr({}, ['page', 'items'], state)
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
          const state = ctx.getState()
          const status = t.pathOr(null, ['nav', 'status'], state)
          const size = t.pathOr('xs', ['screen', 'size'], state)
          const currentNavSize = t.pathOr('xs', ['nav', 'size'], state)
          const nextStatus = t.not(t.or(t.eq(size, 'lg'), t.eq(size, 'xl')))
            ? t.eq(status, navStatus.init)
              ? navStatus.closed
              : status
            : navStatus.init
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

            //console.log('primary', primary)

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

            //console.log('validMatch', validMatch)

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

            //console.log('secondary', secondary)

            const nextMode = t.isEmpty(t.merge(primary.items, primary.actions))
              ? navMode.page
              : t.isNil(validMatch)
              ? navMode.primary
              : t.isEmpty(secondary.items)
              ? navMode.primary
              : navMode.secondary

            //console.log('nextMode', nextMode)

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

            //console.log('nextBody', nextBody)

            // page items
            const matchedBodyItem = t.neq(nextMode, navMode.page)
              ? t.find(
                  item => t.eq(pathname, item.path),
                  t.values(nextBody.items) || []
                )
              : validMatch

            //console.log('matchedBodyItem', matchedBodyItem)

            const checkBodyItem = t.neq(nextMode, navMode.page)
              ? t.and(t.isNil(matchedBodyItem), t.notEmpty(nextBody.items))
                ? sc.nav.find(pathname, nextBody.items)
                : matchedBodyItem
              : validMatch

            //console.log('checkBodyItem', checkBodyItem)

            const finalBodyItem = t.and(
              t.notEmpty(nextBody.items),
              t.and(t.isNil(matchedBodyItem), t.notNil(checkBodyItem))
            )
              ? t.eq(checkBodyItem.path, pathname)
                ? sc.nav.find(checkBodyItem.parentPath || '', schema)
                : matchedBodyItem
              : matchedBodyItem

            //console.log('finalBodyItem', finalBodyItem)

            const pageItems = t.isNil(finalBodyItem)
              ? {}
              : t.notEmpty(t.pathOr({}, ['children'], finalBodyItem))
              ? finalBodyItem.children
              : {}

            //console.log('pageItems', pageItems)

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
                      t.pathOr(
                        {},
                        ['children'],
                        sc.nav.find(validMatch.parentPath || '', schema) || {}
                      )
                    )
                  )
                )
              : secondary.items

            //console.log('nextSecondaryItems', nextSecondaryItems)

            const finalMode = t.eq(nextMode, navMode.page)
              ? nextMode
              : t.isNil(validMatch)
              ? navMode.primary
              : t.isEmpty(nextSecondaryItems)
              ? navMode.primary
              : navMode.secondary

            ////console.log('finalMode', finalMode)

            // mutate
            dispatch(
              box.mutators.navMatch({
                matched: validMatch,
                mode: finalMode,
                title: t.isNil(validMatch)
                  ? t.pathOr('', ['nav', 'title'], state)
                  : validMatch.options.title,
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
        ),
      ]
    },
    afterInit(ctx) {
      ctx.dispatch(ctx.mutators.schemaChange({}))
    },
  })
)
