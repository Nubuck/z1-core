const library = require('@neutrinojs/library')

module.exports = {
  options: {
    root: __dirname,
    output: 'dist',
  },
  use: [
    library({
      name: '@z1/preset-task',
      target: 'node',
      externals: {
        whitelist: [/^ramda.*/, 'change-case', 'common-tags', 'lodash.throttle'],
      },
    }),
  ],
}
