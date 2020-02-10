import mx from '@z1/lib-feature-macros'

// main
export const loadx = mx.fn((t, a) => async (loadList, props) => {
  const preResult = await a.map(loadList, 1, async load => {
    if (t.and(t.isNil(load.method), t.notNil(load.data))) {
      return {
        error: null,
        data: {
          [load.entity]: load.data,
        },
      }
    }
    if (t.isNil(load.method)) {
      return {
        error: loadErr,
        data: {
          [load.entity]: null,
        },
      }
    }
    const [loadErr, loadResult] = await a.of(load.method)
    if (loadErr) {
      return {
        error: loadErr,
        data: {
          [load.entity]: null,
        },
      }
    }
    return {
      error: null,
      data: {
        [load.entity]: t.isNil(load.resultAt)
          ? loadResult
          : t.atOr('data', load.resultAt, loadResult),
      },
    }
  })
  return t.merge(
    {
      status: props.status,
    },
    t.reduce(
      (collection, result) => {
        return t.merge(collection, {
          error: t.notNil(result.error) ? result.error : collection.error,
          data: t.merge(collection.data, result.data),
        })
      },
      { error: null, data: {} },
      preResult
    )
  )
})
