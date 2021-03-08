import React from 'react'
import z from '@z1/lib-feature-box-server'

const passwordChange = z.fn((t, a) => (props) => {
  const user = t.at('user', props)
  const mail = t.at('mail', props)
  const mailService = t.at('service', mail)
  const name = t.at('name', props)
  const brand = t.at('management.brand', props)
  const from = t.at('management.from', props)
  return {
    async passwordChange() {
      const previewText = `Your ${brand} password was changed`
      const mailBody = [
        `Hello ${name},`,
        `Your password was recently changed.`,
        `Please contact your administrator if this was not you.`,
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

export default passwordChange
