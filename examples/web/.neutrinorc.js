const { neutrinoConfig } = require('@z1/lib-ui-box-tailwind')

module.exports = {
  options: {
    output: 'dist',
    root: __dirname,
  },
  use: neutrinoConfig(
    {
      publicPath: '/',
      html: {
        title: 'Z1 Examples',
        links: [
          {
            href: '/static/line-awesome.css',
            rel: 'stylesheet',
          },
        ],
      },
      targets: {
        browsers: ['safari >= 6'],
      },
      minify: {
        babel: false,
      },
    },
    './tailwind.config.js'
  ),
}
