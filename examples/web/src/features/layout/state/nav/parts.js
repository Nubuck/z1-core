import z from '@z1/lib-feature-box'

// ctx
export const navMode = {
  primary: 'primary',
  secondary: 'secondary',
  page: 'page',
}

export const navStatus = {
  init: 'init',
  open: 'open',
  closed: 'closed',
}

export const navSize = {
  primary: 64,
  secondary: 240,
  body: 64,
  bodySm: 66,
  page: 240,
}

export const slotPath = z.fn(t => (item, base) =>
  t.atOr(base || 'nav', 'options.slot', item)
)

// sizing
export const calcPrimaryLeft = z.fn(t => (status, primaryItems = []) =>
  t.or(t.eq(status, 'closed'), t.isEmpty(primaryItems))
    ? 0 - navSize.primary
    : 0
)
export const calcSecondaryLeft = z.fn(t => (status, secondaryItems) =>
  t.or(t.eq(status, 'closed'), t.isEmpty(secondaryItems))
    ? 0 - (navSize.secondary + navSize.primary)
    : navSize.primary
)
export const calcBodyLeft = z.fn(t => (status, size, width, pageNav = false) =>
  t.not(t.or(t.eq(size, 'lg'), t.eq(size, 'xl')))
    ? 0
    : t.eq(status, 'closed')
    ? 0
    : pageNav
    ? width + navSize.page
    : width
)
export const calcBodySpacing = z.fn(t => (key, items, size, height) =>
  t.isEmpty(items)
    ? 0
    : t.includes(size, ['lg', 'xl'])
    ? t.eq(key, 'top')
      ? height
      : 0
    : t.eq(key, 'bottom')
    ? height
    : 0
)
export const calcPageLeft = z.fn(t => (status, size, width, pageStatus) =>
  t.and(
    t.not(t.or(t.eq(size, 'lg'), t.eq(size, 'xl'))),
    t.neq(status, 'closed'), t.eq(pageStatus, 'closed')
  )
    ? -(width + navSize.page)
    : t.not(t.or(t.eq(size, 'lg'), t.eq(size, 'xl')))
    ? 0
    : width
)

// macro
export const registerNav = z.fn(t => ({ anon, secure }) => {
  return {
    onInit(ctx) {
      if (t.notNil(anon)) {
        ctx.dispatch({
          type: 'nav/SCHEMA_REGISTER',
          payload: {
            level: 'anon',
            schema: anon,
          },
        })
      }
      if (t.notNil(secure)) {
        ctx.dispatch({
          type: 'nav/SCHEMA_REGISTER',
          payload: {
            level: 'secure',
            schema: secure,
          },
        })
      }
    },
  }
})
