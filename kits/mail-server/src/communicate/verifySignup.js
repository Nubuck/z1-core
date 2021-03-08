import React from 'react'
import z from '@z1/lib-feature-box-server'

const verifySignup = z.fn((t, a) => (props) => {
  const user = t.at('user', props)
  const mail = t.at('mail', props)
  const mailService = t.at('service', mail)
  const name = t.at('name', props)
  const brand = t.at('management.brand', props)
  const from = t.at('management.from', props)
  return {
    async verifySignup() {
      const previewText = `Thank you, your email has been verified on ${brand}`
      const mailBody = [
        `Hello ${name},`,
        `Thank you for verifying your account.`,
        ` We can now send you a link to reset your password if you ever need it.`,
      ]

      const html = props.Oy.renderTemplate(
        <props.templates.Mail
          {...{
            title: previewText,
            product: brand,
            name,
            mailBody,
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

export default verifySignup
