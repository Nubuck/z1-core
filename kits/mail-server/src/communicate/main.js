import z from '@z1/lib-feature-box-server'
import Oy from 'oy-vey'
import { templates } from '../ui'
import { generateCustomTemplate } from './gererateCustomTemplate'
import normalizeUrl from 'normalize-url'

const makeUrl = (basePath, type, hash) =>
  normalizeUrl(`${basePath}/${type}/${hash}`)

// parts
import resendVerifySignup from './resendVerifySignup'
import verifySignup from './verifySignup'
import sendResetPwd from './sendResetPwd'
import resetPwd from './resetPwd'
import passwordChange from './passwordChange'
import identityChange from './identityChange'

export const communicate = z.fn((t, a) => (app, user) => {
  const management = app.get('management')
  const mail = app.get('mail')
  const mailService = mail.service
  const name = user.name || user.email

  const props = {
    app,
    user,
    management,
    mail,
    mailService,
    name,
    Oy,
    generateCustomTemplate,
    templates,
    makeUrl,
  }
  return t.mergeAll([
    resendVerifySignup(props),
    verifySignup(props),
    sendResetPwd(props),
    resetPwd(props),
    passwordChange(props),
    identityChange(props),
  ])
})

export default communicate
