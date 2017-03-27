const version = require('../package.json').version
const buble = require('rollup-plugin-buble')
const progress = require('rollup-plugin-progress')
const filesize = require('rollup-plugin-filesize')

const banner = `/**
* vue-navigation v${version}
* https://github.com/zack24q/vue-navigation
* Released under the MIT License.
*/
`

const config = {}
config.entry = {
  entry: 'src/index.js',
  plugins: [
    buble(), progress(), filesize()]
}
config.bundles = [{
  banner: banner,
  format: 'es',
  dest: 'dist/vue-navigation.esm.js'
}, {
  banner: banner,
  format: 'umd',
  moduleName: 'VueNavigation',
  dest: 'dist/vue-navigation.umd.js'
}]

module.exports = config
