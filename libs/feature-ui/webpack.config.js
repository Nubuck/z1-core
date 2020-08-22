const neutrino = require('neutrino')

const config = neutrino().webpack()

const aliasConfig = {
  resolve: {
    ...config.resolve,
    alias: {
      ...config.resolve.alias,
      'react-dom': '@hot-loader/react-dom',
    },
  },
}

if (process.env.ENVIRONMENT !== 'production') {
  module.exports = {
    ...config,
    ...aliasConfig,
  }
} else {
  module.exports = config
}
