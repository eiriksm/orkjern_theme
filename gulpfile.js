var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var minifyCSS = require('gulp-minify-css');
var smoosher = require('gulp-smoosher');
var clean = require('gulp-clean');
var sass = require('gulp-sass');
var prefix = require('gulp-autoprefixer');
var rename = require('gulp-rename');
var browserify = require('browserify');
var streamify = require('gulp-streamify');
var source = require('vinyl-source-stream');
var runSequence = require('run-sequence');
var through = require('through2');
var msx = require('msx');
var plumber = require('gulp-plumber');
var gutil = require('gulp-util');

gulp.task('inline', function() {
  return gulp.src('templates/uncompiled/*.html')
    .pipe(smoosher())
    .pipe(rename(function (path) {
      path.basename = path.basename.replace('twig', 'html');
      path.extname = ".twig";
    }))
    .pipe(gulp.dest('templates/'));
});

gulp.task('cachescript', function() {
  return scriptTask('./js/hascache.js', 'hascache.min.js');
});
gulp.task('nocachescript', function() {
  return scriptTask('./js/nocache.js', 'nocache.min.js');
});
gulp.task('css', function() {
  return gulp.src('sass/style.scss')
    .pipe(sass({
      outputStyle: 'compressed',
      errLogToConsole: true,
      error: function(err) {
        console.log(err);
      }
    }))
    .pipe(concat('app.min.css'))
    .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
    .pipe(minifyCSS())
    .pipe(gulp.dest('build/'));
});

function scriptTask(path, filename) {
  return browserify(path)
    .bundle()
    .pipe(source(filename))
    .pipe(streamify(uglify()))
    .pipe(gulp.dest('build/'));
}

gulp.task('clean', function() {
  return gulp.src('build', {read: false})
    .pipe(clean());
});

// Watch
gulp.task('watch', function() {
  gulp.watch(['js/**/*', 'sass/**/*'], ['build']);
});

function msxTransform(name) {
  return through.obj(function (file, enc, cb) {
    try {
      file.contents = new Buffer(msx.transform(file.contents.toString()));
      file.path = gutil.replaceExtension(file.path, '.js');
    }
    catch (err) {
      err.fileName = file.path;
      this.emit('error', new gutil.PluginError('msx', err));
    }
    this.push(file);
    cb();
  });
}
gulp.task('msx', function() {
  return gulp.src('./js/src/views/jsx/*.jsx')
    .pipe(plumber())
    .pipe(msxTransform())
    .on('error', function(e) {
      console.error(e.message + '\n  in ' + e.fileName);
    })
    .pipe(gulp.dest('./js/src/views/'));
});
gulp.task('build', function(callback) {
  runSequence('clean',
              'msx',
              ['cachescript', 'nocachescript', 'css'],
              'inline',
              callback);
});

gulp.task('default', ['clean'], function() {
  gulp.start('css', 'cachescript', 'nocachescript');
});
