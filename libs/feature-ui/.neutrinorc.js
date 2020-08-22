const reactElements = require('@neutrinojs/react-components')
module.exports = {
  options: {
    output: 'dist',
    root: __dirname,
  },
  use: [
    reactElements({
      components: 'elements',
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
        title: 'Feature Elements',
        template: require.resolve('./src/index.ejs'),
      },
      targets: {
        browsers: ['safari >= 6'],
      },
      babel: {
        presets: [
          [
            '@babel/preset-env',
            {
              exclude: ['@babel/plugin-transform-classes'],
            },
          ],
        ],
      },
    }),
  ],
}
