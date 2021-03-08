const library = require('@neutrinojs/library')

module.exports = {
  options: {
    root: __dirname,
    output: 'dist',
  },
  use: [
    library({
      name: '@z1/kit-mail-server',
      target: 'node',
      babel: {
        presets: ['@babel/preset-react'],
      },
    }),
  ],
}
