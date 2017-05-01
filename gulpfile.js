var gulp = require('gulp');
var concat = require('gulp-concat');
var closureCompiler = require('gulp-closure-compiler');
var minifyCSS = require('gulp-minify-css');
var smoosher = require('gulp-smoosher');
var rimraf = require('rimraf');
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
var karma = require('karma').server;

/**
 * Run test once and exit
 */
gulp.task('testscript', function (done) {
  return scriptTask('./test/test.js', 'test.js');
});
gulp.task('test', function (done) {
  karma.start({
    configFile: __dirname + '/karma.conf.js',
    singleRun: true
  }, done);
});

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
gulp.task('minifynocache', function() {
  return minifier('nocache.min.js');
});
gulp.task('minifycache', function() {
  return minifier('hascache.min.js');
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
    .pipe(gulp.dest('build/'));
}

function minifier(filename) {
  return gulp.src('build/' + filename)
    .pipe(streamify(
      closureCompiler({
        compilerPath: 'node_modules/gulp-closure-compiler/node_modules/google-closure-compiler/compiler.jar',
        fileName: filename,
        compilerFlags: {
          language_in: "ECMASCRIPT5"
        }
    })))
    .pipe(gulp.dest('build'));
}

gulp.task('clean', function(cb) {
  return rimraf('./build', cb);
});

// Watch
gulp.task('watch', function() {
  gulp.watch(['js/**/*', 'sass/**/*', 'templates/uncompiled/*'], ['build']);
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
  runSequence(
              'msx',
              ['cachescript', 'nocachescript', 'css'],
              ['minifycache', 'minifynocache'],
              'inline',
              callback);
});
gulp.task('browsertest', function(callback) {
  runSequence('clean',
              'testscript',
              'test',
              callback);
});

gulp.task('default', ['clean'], function() {
  gulp.start('css', 'cachescript', 'nocachescript');
});
