import heml from 'heml'
import normalizeUrl from 'normalize-url'

const makeUrl = (
  basePath,
  type,
  hash,
) => normalizeUrl(`${basePath}/${type}/${hash}`)

const VerifyLayout = ({
  subject,
  header,
  children,
  link,
  linkText,
}) => {
  const action = !link
    ? ''
    : `<row>
        <column>
          <button href="${link}">
            ${linkText}
          </button>
        </column>        
      </row>`
  return heml(`
    <heml>
      <head>
        <subject>
          ${subject}
        </subject>
        <style>
          body {
            background: #FFF;
          }
          container {
            padding: 10px 20px;
          }
          column {
            padding: 0 10px;
          }
          button {
            background: #006341;
            color: #FFF;
            padding: 10px 20px;
          }
          .text-primary {
            color: #006341;
          }
      </style>
     </head>
     <body>
        <container>
          <row>
            <column>
              <h2 class="text-primary">
               ${header}
              </h2>  
            </column>  
          </row>
          <row>
            <column>
              ${children}
            </column>
          </row>
          ${action}
        </container>
      </body>
    </heml>
  `)
}

const Verify = ({
  subject,
  product,
  name,
  verifyLink,
}) => VerifyLayout({
  subject,
  header: `Welcome to ${product}`,
  children: `
    <p>
      Hello ${name},
    </p>
    <p>
      Thank you for signing up.
    </p>
    <p>
      Please verify your email so you can 
      reset your password if need be.
    </p>
    <p>
      You may still use the site if your email is
      unverified but we can't send you emails.
    </p>
    `,
  link: verifyLink,
  linkText: 'Verify your email',
})

const Verified = ({
  subject,
  product,
  name,
}) => VerifyLayout({
  subject,
  header: ` Your email has been verified on ${product}`,
  children: `
    <p>
      Hello ${name},
    </p>
    <p>
      We can now send you a link to reset your 
      password if you ever need it.
    </p>
    `,
})

const PasswordReset = ({
  subject,
  product,
  name,
  resetLink,
}) => VerifyLayout({
  subject,
  header: `Reset your ${product} password.`,
  children: `
    <p>
      Hello ${name},
    </p>
    <p>
      We received a request to reset your password.
    </p>
    <p>
      If you ignore this message your password 
      won't be changed.
    </p>
    `,
  link: resetLink,
  linkText: 'Reset your password',
})

const PasswordDidReset = ({
  subject,
  product,
  name,
}) => VerifyLayout({
  subject,
  header: `Your ${product} password reset.`,
  children: `
    <p>
      Hello ${name},
    </p>
    <p>
      Your password has been successfully reset
    </p>
    `,
})

const PasswordDidChange = ({
  subject,
  product,
  name,
}) => VerifyLayout({
  subject,
  header: `Your ${product} password has been changed.`,
  children: `
    <p>
      Hello ${name},
    </p>
    <p>
      Your password was recently changed.
    </p>
    `,
})

const IdentityChange = ({
  subject,
  product,
  name,
  verifyLink,
}) => VerifyLayout({
  subject,
  header: `Please verify updates to your ${product} account.`,
  children: `
    <p>
      Hello ${name},
    </p>
    <p>
      We received a request to update your account details.
    </p>
    <p>
      Please verify that you made these changes.
    </p>
    `,
  link: verifyLink,
  linkText: 'Verify account update',
})

// product name and other content via config file
export const communicate = (app, user) => {
  const management = app.get('management')
  const mailService = 'mail'
  const name = user.name || user.email
  return {
    async resendVerifySignup() {
      const subject = `Verify signing up to ${management.product}`
      const { html } = await Verify({
        subject,
        product: management.product,
        name,
        verifyLink: makeUrl(management.path, 'verify', user.verifyToken),
      })
      return app
        .service(mailService)
        .create({
          from: management.from,
          to: user.email,
          subject,
          html,
        })
    },
    async verifySignup() {
      const subject = `Thank you, your email has been verified on ${management.product}`
      const { html } = await Verified({
        subject,
        product: management.product,
        name,
      })
      return app
        .service(mailService)
        .create({
          from: management.from,
          to: user.email,
          subject,
          html,
        })
    },
    async sendResetPwd() {
      const subject = `Reset your ${management.product} password`
      const { html } = await PasswordReset({
        subject,
        product: management.product,
        name,
        resetLink: makeUrl(management.path, 'reset', user.resetToken),
      })
      return app
        .service(mailService)
        .create({
          from: management.from,
          to: user.email,
          subject,
          html,
        })
    },
    async resetPwd() {
      const subject = `Your ${management.product} password was reset`
      const { html } = await PasswordDidReset({
        subject,
        product: management.product,
        name,
      })
      return app
        .service(mailService)
        .create({
          from: management.from,
          to: user.email,
          subject,
          html,
        })
    },
    async passwordChange() {
      const subject = `Your ${management.product} password was changed`
      const { html } = await PasswordDidChange({
        subject,
        product: management.product,
        name,
      })
      return app
        .service(mailService)
        .create({
          from: management.from,
          to: user.email,
          subject,
          html,
        })
    },
    async identityChange() {
      const subject = `Your ${management.product} account was changed. Please verify changes`
      const { html } = await IdentityChange({
        product: management.product,
        name,
        verifyLink: makeUrl(management.path, 'change', user.verifyToken),
      })
      return app
        .service(mailService)
        .create({
          from: management.from,
          to: user.email,
          subject,
          html,
        })
    },
  }
}