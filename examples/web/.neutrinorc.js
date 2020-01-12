const reactWeb = require('@neutrinojs/react')
const copy = require('@neutrinojs/copy')
module.exports = {
  options: {
    output: 'dist',
    root: __dirname,
  },
  use: [
    copy({
      patterns: [
        {
          context: 'src/static',
          from: '**/*',
          to: 'static',
        },
      ],
    }),
    reactWeb({
      publicPath: '/',
      style: {
        loaders: [
          {
            loader: 'postcss-loader',
            useId: 'postcss',
            options: {
              config: {
                path: __dirname,
              },
            },
          },
        ],
      },
      html: {
        title: 'Z1 Examples',
        template: require.resolve('./src/index.ejs'),
      },
      targets: {
        browsers: ['safari >= 6'],
      },
    }),
  ],
}
