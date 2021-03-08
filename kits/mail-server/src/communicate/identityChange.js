import React from 'react'
import z from '@z1/lib-feature-box-server'

const identityChange = z.fn((t, a) => (props) => {
  const user = t.at('user', props)
  const mail = t.at('mail', props)
  const mailService = t.at('service', mail)
  const name = t.at('name', props)
  const brand = t.at('management.brand', props)
  const path = t.at('management.path', props)
  const from = t.at('management.from', props)
  return {
    async identityChange() {
      const previewText = `Your ${brand}  account was changed. Please verify changes`
      const mailBody = [
        `Hello ${name},`,
        `We received a request to update your account details.`,
        `Please verify that you made these changes.`,
      ]

      const html = props.Oy.renderTemplate(
        <props.templates.Mail
          {...{
            title: previewText,
            product: brand,
            name,
            mailBody,
            verifyLink: makeUrl(path, 'change', user.verifyToken),
            linkText: 'Verify account update',
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

export default identityChange
