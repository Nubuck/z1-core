import z from '@z1/lib-feature-box'
import { types } from '../types'

// main
export const transmitx = z.fn((t, a) => async (transmitList, props) => {
  const active = t.atOr(
    t.atOr('none', 'modal.active', props),
    'next.active',
    props
  )
  const activeTransmit = t.find(
    (transmission) => t.eq(active, transmission.form),
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
      error: transmitErr,
      data,
    }
  }

  return {
    status: t.and(
      t.eq(activeTransmit.result, true),
      t.has('status')(transmitResult || {})
    )
      ? transmitResult.status
      : props.status,
    error: t.and(
      t.eq(activeTransmit.result, true),
      t.has('error')(transmitResult || {})
    )
      ? transmitResult.error
      : null,
    data: t.eq(activeTransmit.result, true)
      ? t.notNil(activeTransmit.entity)
        ? { [activeTransmit.entity]: transmitResult }
        : t.has('data')(transmitResult || {})
        ? transmitResult.data
        : transmitResult
      : {},
  }
})
export default transmitx
