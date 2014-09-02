var gulp = require('gulp');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var fs = require('fs');
var path = require('path');

gulp.task('build', function() {
  var files = fs.readdir('js', function(err, files) {
    files.forEach(function(f) {
      var bundle = browserify(path.join(__dirname, 'js', f)).bundle();
      bundle.pipe(source(f))
        .pipe(gulp.dest(path.join(__dirname, 'build')));
    });
  });
});

gulp.task('watch', function() {
  gulp.watch(['js/*.js'], ['build']);
});
