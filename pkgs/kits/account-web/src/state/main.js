// parts
import { authStatus } from '../fn'
import { mutations } from './mutations'
import { guards } from './guards'
import { effects } from './effects'
import { onInit } from './onInit'

// main
export const authState = (boxName = 'account', props = {}) => {
  return {
    initial: {
      connected: false,
      authStatus: authStatus.init,
      user: null,
      error: null,
      redirectBackTo: null,
      hash: null,
      info: null,
    },
    mutations: mutations(boxName, props),
    guards: guards(boxName, props),
    effects: effects(boxName, props),
    onInit: onInit(boxName, props),
  }
}
