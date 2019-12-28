const node = require('@z1/preset-dev-neutrino/lib/node')
module.exports = {
  options: {
    output: 'lib',
    root: __dirname,
  },
  use: [node()],
}
