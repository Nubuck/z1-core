import initial from './init'
import data, { mutateEntity } from './data'
import load from './load'
import subscribe, { isAction } from './sub'
import form from './form'
import transmit from './transmit'
import modal from './modal'

// main
export const auto = {
  initial,
  data,
  load,
  subscribe,
  form,
  transmit,
  modal,
  isAction,
  mutateEntity,
}
