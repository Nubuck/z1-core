module.exports = {
  options: {
    output: 'lib',
    root: __dirname,
  },
  use: [
    // '@z1/preset-dev-neutrino/lib/node',
    [
      '@z1/preset-dev-neutrino/lib/library', {
      name: 'machine-account-server-core',
      target: 'node',
      libraryTarget: 'commonjs2',
      // Add additional Babel plugins, presets, or env options
      babel: {
        // Override options for babel-preset-env
        presets: [
          [
            'babel-preset-env', {
            targets: {
              node: '8.0',
            },
          },
          ],
        ],
      },
    },
    ],
    '@z1/preset-dev-neutrino/lib/jest',
  ],
}
