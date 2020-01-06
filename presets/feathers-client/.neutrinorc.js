const library = require('@z1/preset-dev-neutrino/lib/library')
module.exports = {
  options: {
    output: 'lib',
    root: __dirname,
  },
  use: [
    library({
      name: '@z1/preset-feathers-client',
      target: 'web',
      babel: {
        // Override options for babel-preset-env
        presets: [
          [
            '@babel/preset-env',
            {
              // Passing in browser targets to babel-preset-env will replace them
              // instead of merging them when using the 'web' target
              targets: {
                browsers: ['safari >= 6'],
              },
            },
          ],
        ],
      },
    }),
    neutrino =>
      neutrino.config.module
        .rule('compile')
        .test(/\.(js|jsx|vue|ts|tsx|mjs)$/)
        .include.add(/feathers/),
    neutrino => neutrino.config.externals([]),
  ],
}
