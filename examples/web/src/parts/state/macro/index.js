import { initx } from './initx'
import { datax, mutateEntityList } from './datax'
import { loadx } from './loadx'
import { subx } from './subx'
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
  mutateEntity: mutateEntityList,
}
