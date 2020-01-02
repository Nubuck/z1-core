const react = require('@neutrinojs/react')
const merge = require('deepmerge')
const nodeExternals = require('webpack-node-externals')
const { extname, join, basename } = require('path')
const MODULES = join(__dirname, 'node_modules')

module.exports = (neutrino, opts = {}) => {
  const options = merge(
    {
      html: process.env.NODE_ENV === 'development' && {
        title: 'React Preview',
      },
      manifest: process.env.NODE_ENV === 'development',
      externals: opts.externals !== false && {},
      style: { extract: { plugin: { filename: '[name].css' } } },
    },
    opts
  )

  neutrino.config.resolve.modules
    .add(MODULES)
    .when(__dirname.includes('neutrino-dev'), modules => {
      // Add monorepo node_modules to webpack module resolution
      modules.add(join(__dirname, '../../node_modules'))
    })
  neutrino.config.resolveLoader.modules
    .add(MODULES)
    .when(__dirname.includes('neutrino-dev'), modules => {
      // Add monorepo node_modules to webpack module resolution
      modules.add(join(__dirname, '../../node_modules'))
    })

  neutrino.use(react, options)

  Object.keys(neutrino.options.mains).forEach(key => {
    neutrino.config.plugins.delete(`html-${key}`)
  })

  neutrino.config
    .when(options.externals, config =>
      config.externals([nodeExternals(options.externals)])
    )
    .devtool('source-map')
    .performance.hints('error')
    .end()
    .output.filename('[name].js')
    .library('[name]')
    .libraryTarget('umd')
    .umdNamedDefine(true)

  neutrino.config.when(neutrino.config.plugins.has('runtime-chunk'), config => {
    config.plugins
      .delete('runtime-chunk')
      .delete('vendor-chunk')
      .delete('named-modules')
      .delete('named-chunks')
      .delete('name-all')
  })
}
