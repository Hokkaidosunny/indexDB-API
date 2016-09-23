import babel from 'rollup-plugin-babel';

export default {
  entry: 'lib/indexdb.js',
  format: 'cjs',
  plugins: [babel({
    exclude: 'node_modules/**'
  })],
  dest: 'dist/indexdb.bundle.js'
};
