const library = require('@z1/preset-dev-neutrino/lib/library')
module.exports = {
  options: {
    output: 'lib',
    root: __dirname,
  },
  use: [
    library({
      name: 'bucket-storage-server',
      target: 'node',
      libraryTarget: 'commonjs2',
      // Add additional Babel plugins, presets, or env options
      babel: {
        // Override options for babel-preset-env
        presets: [
          [
            'babel-preset-env',
            {
              targets: {
                node: '10.0',
              },
            },
          ],
        ],
      },
    }),
  ],
}
