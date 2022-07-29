const library = require('@neutrinojs/library');

module.exports = {
  options: {
    root: __dirname,
    output: 'dist',
  },
  use: [
    library({
      name: '@z1/lib-feature-box-server',
      target: 'node',
    }),
  ],
};
