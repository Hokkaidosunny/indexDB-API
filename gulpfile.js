const gulp = require('gulp');
const rollup = require('rollup');
const babel = require('rollup-plugin-babel');
const commonjs = require('rollup-plugin-commonjs');
const nodeResolve = require('rollup-plugin-node-resolve');
const builtins = require('rollup-plugin-node-builtins');

const opts = {
  src: './lib/index.js',
  dest: './dist/indexdb.bundle.js',
  moduleName: 'IndexDB',
  babel_opts: {
    exclude: 'node_modules/**',
    presets: [
      "stage-0",
      ["es2015", {
        "modules": false
      }]
    ],
    plugins: [
      "external-helpers"
    ]
  }
};

gulp.task('rollup', function() {
  rollup.rollup({
    entry: opts.src,
    plugins: [
      builtins(),
      nodeResolve({
        jsnext: true,
        main: true,
        browser: true
      }),
      commonjs(),
      babel(opts.babel_opts)
    ]
  }).then(function (bundle) {
    return bundle.write({
      dest: opts.dest,
      moduleName: opts.moduleName,
      format: "umd"
    });
  }).catch(function(e) {
    console.error(e);
  });
});

gulp.task('watch:rollup', function(){
  gulp.watch('./lib/*.js', ['rollup']);
});
