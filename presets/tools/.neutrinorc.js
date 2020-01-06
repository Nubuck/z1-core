const library = require('@neutrinojs/library')
module.exports = {
  options: {
    output: 'lib',
    root: __dirname,
  },
  use: [
    library({
      name: '@z1/preset-tools',
      target: 'node',
      libraryTarget: 'commonjs2',
      babel: {
        // Override options for babel-preset-env
        presets: [
          [
            '@babel/preset-env',
            {
              targets: {
                node: '10.0',
              },
            },
          ],
        ],
        plugins: [
          [
            '@babel/plugin-transform-runtime',
            {
              regenerator: true,
            },
          ],
        ],
      },
    }),
  ],
}
