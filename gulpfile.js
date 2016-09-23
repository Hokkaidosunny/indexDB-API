var gulp = require('gulp');

gulp.task('rollup', function() {
  var rollup = require('rollup');
  var babel = require('rollup-plugin-babel');

  rollup.rollup({
    entry: 'lib/indexdb.js',
    plugins: [
      babel({
        exclude: 'node_modules/**'
      })
    ]
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
