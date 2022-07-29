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
        whitelist: [
          /^ramda.*/,
          'camel-case',
          'snake-case',
          'path-case',
          'sentence-case',
          'dot-case',
          'constant-case',
          'param-case',
          'common-tags',
          'lodash.throttle',
        ],
      },
    }),
  ],
}
