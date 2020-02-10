import mx from '@z1/lib-feature-macros'
const { types } = mx.view

// parts
const isAction = mx.fn(t => current =>
  t.allOf([t.has('type')(current), t.has('payload')(current)])
)
export const subx = mx.fn((t, _, rx) => subs => {
  const next = t.reduce(
    (collection, sub) => {
      const obs = t.map(
        event => ({
          service$: rx.fromEvent(sub.service, event),
          change: 'sub',
          event,
          entity: sub.entity,
          id: t.atOr('_id', 'id', sub),
          parent: t.at('parent', sub),
          mutator: t.at('mutator', sub),
        }),
        sub.events
      )
      return t.concat(collection, obs)
    },
    [],
    subs
  )
  const entry = t.head(next)
  if (t.eq(t.len(next), 1)) {
    return entry.service$.pipe(
      rx.map(current =>
        entry.mutator({
          change: 'sub',
          id: t.atOr('_id', 'id', entry),
          parent: t.at('parent', entry),
          entity: entry.entity,
          event: entry.event,
          data: current,
        })
      )
    )
  }
  const rest$ = t.map(obs => {
    return obs.service$.pipe(
      rx.map(current => {
        if (isAction(current)) {
          return current
        }
        return obs.mutator({
          change: 'sub',
          id: t.atOr('_id', 'id', obs),
          parent: t.at('parent', obs),
          entity: obs.entity,
          event: obs.event,
          data: current,
        })
      })
    )
  }, t.tail(next))
  return entry.service$.pipe(
    rx.merge(...rest$),
    rx.map(current => {
      if (isAction(current)) {
        return current
      }
      return entry.mutator({
        change: 'sub',
        id: t.atOr('_id', 'id', entry),
        parent: t.at('parent', entry),
        entity: entry.entity,
        event: entry.event,
        data: current,
      })
    })
  )
})

