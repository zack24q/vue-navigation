const rollup = require('rollup')
const config = require('./rollup.config.js')

rollup.rollup(config.entry).then(bundle => {
  config.bundles.map(value => {
    bundle.write(value)
  })
})
