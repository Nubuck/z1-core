import React from 'react'
import z from '@z1/lib-feature-box-server'

const resendVerifySignup = z.fn((t, a) => (props) => {
  const user = t.at('user', props)
  const mail = t.at('mail', props)
  const mailService = t.at('service', mail)
  const name = t.at('name', props)
  const brand = t.at('management.brand', props)
  const path = t.at('management.path', props)
  const from = t.at('management.from', props)
  return {
    async resendVerifySignup() {
      const previewText = `Verify signing up to ${brand}`
      const mailBody = [
        `Hello ${name},`,
        `Thank you for signing up.`,
        `Please verify your email so you can reset your password if need be.`,
        `You cannot use the site if your email is unverified.`,
      ]

      const html = props.Oy.renderTemplate(
        <props.templates.Mail
          {...{
            title: previewText,
            product: brand,
            name,
            mailBody,
            verifyLink: props.makeUrl(path, 'verify', user.verifyToken),
            linkText: 'Verify',
          }}
        />,
        {
          previewText,
          bgColor: 'rgb(16, 19, 26)',
          lang: 'eng',
          dir: '',
          title: brand,
          headCSS: '',
        },
        (options) => props.generateCustomTemplate(options)
      )

      return props.app.service(mailService).create({
        from,
        to: user.email,
        subject: previewText,
        html,
      })
    },
  }
})

export default resendVerifySignup
