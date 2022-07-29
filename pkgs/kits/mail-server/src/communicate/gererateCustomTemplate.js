import z from '@z1/lib-feature-box-server'

export const generateCustomTemplate = z.fn((t, a) => (templateOptions) => {
  return `
        <!doctype html>
        <html>
          <head>
            <title>${templateOptions.title}</title>
          </head>
          <body>
            ${templateOptions.bodyContent}
          </body>
        </html>
      `
})

export default generateCustomTemplate
