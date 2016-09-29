var gulp = require('gulp');
var rollup = require('rollup');
var commonjs = require('rollup-plugin-commonjs');
var nodeResolve = require('rollup-plugin-node-resolve');
var babel = require('rollup-plugin-babel');

gulp.task('rollup', function() {
  rollup.rollup({
    entry: 'lib/indexdb.js',
    plugins: [
      nodeResolve({ jsnext: true, main:true, browser: true }),
      commonjs(),
      babel()
    ],
    moduleName: 'IndexDB'
  }).then(function (bundle) {
    bundle.write({
      dest: "dist/indexdb.bundle.js",
      format: "umd"
    });
  })
});

gulp.task('watch:rollup', function(){
  gulp.watch('lib/indexdb.js', ['rollup']);
});
