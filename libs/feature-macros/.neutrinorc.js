module.exports = {
  options: {
    output: 'lib',
    root: __dirname,
  },
  use: ['@z1/preset-dev-neutrino/lib/node', '@z1/preset-dev-neutrino/lib/jest'],
}
