import z from '@z1/lib-feature-box'

// parts
export const isAction = z.fn((t) => (current) =>
  t.allOf([t.has('type')(current), t.has('payload')(current)])
)
const withEvent = (filter, event) => (item) =>
  isAction(item) ? true : filter(item, event)

// main
export const subx = z.fn((t, _, rx) => (subs) => {
  const next = t.reduce(
    (collection, sub) => {
      const obs = t.map((event) => {
        const eventAs = t.ofType('array', event)
        const serviceEvent = eventAs ? t.head(event) : event
        const dataEvent = eventAs ? event[1] : event
        return {
          service$: t.and(t.isNil(sub.service), t.notNil(sub.source$))
            ? sub.source$
            : rx.fromEvent(sub.service, serviceEvent),
          change: 'sub',
          event: dataEvent,
          entity: sub.entity,
          id: t.atOr('_id', 'id', sub),
          parent: t.at('parent', sub),
          mutator: t.at('mutator', sub),
          filter: t.at('filter', sub),
          prepend: t.atOr(false, 'prepend', sub),
        }
      }, sub.events)
      return t.concat(collection, obs)
    },
    [],
    subs
  )
  const entry = t.head(next)
  if (t.eq(t.len(next), 1)) {
    const early$ = t.isType(entry.filter, 'function')
      ? [rx.filter(withEvent(entry.filter, entry.event))]
      : []
    early$.push(
      rx.map((current) =>
        entry.mutator({
          change: 'sub',
          id: t.atOr('_id', 'id', entry),
          parent: t.at('parent', entry),
          entity: entry.entity,
          event: entry.event,
          data: current,
          prepend: entry.prepend,
        })
      )
    )
    return entry.service$.pipe(...early$)
  }
  const rest$ = t.map((obs) => {
    const obs$ = t.isType(obs.filter, 'function')
      ? [rx.filter(withEvent(obs.filter, obs.event))]
      : []
    obs$.push(
      rx.map((current) => {
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
          prepend: obs.prepend,
        })
      })
    )
    return obs.service$.pipe(...obs$)
  }, t.tail(next))
  const entry$ = t.isType(entry.filter, 'function')
    ? [rx.filter(withEvent(entry.filter, entry.event))]
    : []
  entry$.push(
    rx.map((current) => {
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
        prepend: entry.prepend,
      })
    })
  )
  return entry.service$.pipe(rx.merge(...rest$), ...entry$)
})
export default subx
