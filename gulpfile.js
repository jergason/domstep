var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var fs = require('fs');
var path = require('path');
var reactify = require('reactify');

gulp.task('build', function() {
  var files = fs.readdir('js', function(err, files) {
    files.forEach(function(f) {
      if (!/.*\.js$/.test(f)) {
        //skip dirs
        return;
      }
      var b = browserify(path.join(__dirname, 'js', f));
      b.transform(reactify);
      var bundle = b.bundle();
      bundle.pipe(source(f))
        .pipe(gulp.dest(path.join(__dirname, 'build')));
    });
  });
});

gulp.task('watch', function() {
  gulp.watch(['js/**'], ['build']);
});
