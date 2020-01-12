const node = require('@neutrinojs/node');

module.exports = {
  options: {
    root: __dirname,
    output: 'dist',
  },
  use: [
    node(),
  ],
};
