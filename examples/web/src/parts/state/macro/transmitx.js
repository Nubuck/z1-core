import mx from '@z1/lib-feature-macros'
const { types } = mx.view

// main
export const transmitx = mx.fn((t, a) => async (transmitList, props) => {
  const active = t.atOr(
    t.atOr('none', 'modal.active', props),
    'next.active',
    props
  )
  const activeTransmit = t.find(
    transmission => t.eq(active, transmission.form),
    transmitList
  )
  if (t.isNil(activeTransmit)) {
    return null
  }
  const data = t.notNil(activeTransmit.dataAt)
    ? t.at(activeTransmit.dataAt, props)
    : t.pathOr({}, ['form', activeTransmit.form, 'data'], props)
  const method = activeTransmit.method(data)
  if (t.isNil(method)) {
    return null
  }
  const [transmitErr, transmitResult] = await a.of(method)
  if (transmitErr) {
    return {
      status: types.status.fail,
      error: bucketErr,
      data,
    }
  }
  return {
    status: props.status,
    error: null,
    data: t.eq(activeTransmit.result, true)
      ? t.notNil(activeTransmit.entity)
        ? { [activeTransmit.entity]: transmitResult }
        : transmitResult
      : {},
  }
})
