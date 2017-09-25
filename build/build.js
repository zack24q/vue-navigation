const version = require('../package.json').version
const fs = require('fs')
const rollup = require('rollup')
const babel = require('rollup-plugin-babel')
const progress = require('rollup-plugin-progress')
const filesize = require('filesize')
const uglifyES = require('uglify-es')
const uglifyJS = require('uglify-js')

const banner = `/**
* vue-navigation v${version}
* https://github.com/zack24q/vue-navigation
* Released under the MIT License.
*/
`
const inputOptions = {
  entry: 'src/index.js',
  plugins: [babel(), progress()]
}
const uglifyOptions = () => {
  return {
    output: {
      comments: true
    }
  }
}
const targets = [
  {
    name: 'vue-navigation.esm',
    options: {
      banner: banner,
      format: 'es'
    },
    uglify: uglifyES
  },
  {
    name: 'vue-navigation.umd',
    options: {
      banner: banner,
      format: 'umd',
      moduleName: 'VueNavigation'
    },
    uglify: uglifyJS
  }
]

rollup.rollup(inputOptions).then(bundle => {
  const size = code => filesize(Buffer.byteLength(code))
  console.info('\nfiles size:')
  targets.forEach(({ name, options, uglify }) => {
    const code = bundle.generate(options).code
    console.info(`${name}.js      ${size(code)}`)
    fs.writeFileSync(`dist/${name}.js`, code, 'utf8')
    const result = uglify.minify(code, uglifyOptions())
    result.error && console.error(result.error)
    console.info(`${name}.min.js  ${size(result.code)}`)
    fs.writeFileSync(`dist/${name}.min.js`, result.code, 'utf8')
  })

  console.info('\nbuild done.')
})
