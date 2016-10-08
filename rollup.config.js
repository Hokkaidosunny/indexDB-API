import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';

export default {
  entry: 'lib/index.js',
  format: 'umd',
  sourceMap: 'inline',
  plugins: [
    nodeResolve({ jsnext: true, main:true, browser: true }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
      presets: [["es2015", {
        "modules": false,
        "loose": true
      }]],
      plugins: [
        "external-helpers",
        "transform-object-rest-spread"
      ]
    })
  ],
  moduleName: 'IndexDB',
  dest: 'dist/indexdb.bundle.js'
};
