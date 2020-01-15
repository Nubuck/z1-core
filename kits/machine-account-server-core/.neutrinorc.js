const library = require('@neutrinojs/library')

module.exports = {
  options: {
    root: __dirname,
    output: 'dist',
  },
  use: [
    library({
      name: '@z1/kit-machine-account-server-core',
      target: 'node',
    }),
  ],
}
