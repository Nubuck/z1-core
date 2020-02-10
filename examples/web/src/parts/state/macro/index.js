import { initx } from './initx'
import { datax, mutateEntity } from './datax'
import { loadx } from './loadx'
import { subx, isAction } from './subx'
import { formx } from './formx'
import { transmitx } from './transmitx'
import { modalx } from './modalx'

// main
export const macro = {
  initial: initx,
  data: datax,
  load: loadx,
  subscribe: subx,
  form: formx,
  transmit: transmitx,
  modal: modalx,
  isAction,
  mutateEntity,
}
