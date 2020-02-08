import mx from '@z1/lib-feature-macros'

// parts
const subscribe = mx.fn((t, _, rx) => (mutator, subs) => {
  const next = t.reduce(
    (collection, sub) => {
      const obs = t.map(
        event => ({
          service$: rx.fromEvent(sub.service, event),
          event,
          entity: sub.entity,
        }),
        sub.events
      )
      return t.concat(collection, obs)
    },
    [],
    subs
  )
  const entry = t.head(next)
  const rest$ = t.map(obs => {
    return obs.service$.pipe(
      rx.map(current => {
        if (
          t.allOf([
            t.has('change')(current),
            t.has('entity')(current),
            t.has('data')(current),
          ])
        ) {
          return current
        }
        return {
          change: obs.event,
          entity: obs.entity,
          data: current,
        }
      })
    )
  }, t.tail(next))
  return entry.service$.pipe(
    rx.merge(...rest$),
    rx.map(current => {
      if (
        t.allOf([
          t.has('change')(current),
          t.has('entity')(current),
          t.has('data')(current),
        ])
      ) {
        return mutator(current)
      }
      return mutator({
        change: entry.event,
        entity: entry.entity,
        data: current,
      })
    })
  )
})

// main
export const macros = {
  subscribe,
}
