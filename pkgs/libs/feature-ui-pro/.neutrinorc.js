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
        test: /\.(css|sass|scss)$/,
        loaders: [
          {
            loader: 'postcss-loader',
            options: {
              plugins: [require('autoprefixer')],
            },
          },
          {
            loader: 'sass-loader',
            useId: 'sass',
          },
        ],
      },
      html: {
        title: 'Feature Elements Pro',
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
      devServer: {
        port: 5005,
      },
    }),
  ],
}
