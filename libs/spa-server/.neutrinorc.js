// const nodeExternals = require('webpack-node-externals')
module.exports = {
  options: {
    output: 'lib',
    root: __dirname,
  },
  use: [
    '@z1/preset-dev-neutrino/lib/node',
    '@z1/preset-dev-neutrino/lib/jest',
    // neutrino => neutrino
    //   .config
    //   .externals([
    //     nodeExternals({
    //       whitelist: [
    //         /^webpack/,
    //         '@z1/kit-account-server',
    //         '@z1/kit-bucket-storage-server',
    //         '@z1/kit-mail-server',
    //         '@z1/lib-feature-box-server',
    //         '@z1/preset-tools',
    //       ],
    //     }),
    //   ]),
  ],
}
