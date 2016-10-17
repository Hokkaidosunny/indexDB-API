var gulp = require('gulp');
var tasks = require('gulp-tasks');//自己本地的包，未发布

gulp.task('rollup', function() {
  tasks.rollup_task({
    src: './lib/index.js',
    dest: './dist/indexdb.bundle.js',
    moduleName: 'IndexDB'
  });
});

gulp.task('watch:rollup', function(){
  gulp.watch('./lib/*.js', ['rollup']);
});
