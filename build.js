const buidMyPackage = require('build-my-package')
const path = require('path')

const { buildUMD } = buidMyPackage

buildUMD({
  entry: path.join(__dirname, './src/index.js'),
  library: 'IndexDB',
  filename: 'index.js'
})
