module.exports = {
  options: {
    output: 'lib',
    root: __dirname,
  },
  use: [
    [
      '@neutrinojs/library',
      {
        name: '@z1/preset-task',
        target: 'web',
        libraryTarget: 'commonjs2',
        babel: {
          // Override options for babel-preset-env
          presets: [
            [
              'babel-preset-env', {
              // Passing in browser targets to babel-preset-env will replace them
              // instead of merging them when using the 'web' target
              targets: {
                browsers: [
                  'safari >= 6',
                ],
              },
            },
            ],
          ],
        },
      },
    ],
    neutrino => neutrino
      .config
      .externals([]),
  ],
}
