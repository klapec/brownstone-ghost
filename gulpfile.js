var gulp          = require('gulp');
var gutil         = require('gulp-util');
var del           = require('del');
var jshintStylish = require('jshint-stylish');
var $             = require('gulp-load-plugins')();

var basePath = {
  src   : 'assets/src/',
  dist  : 'assets/dist/'
};

var srcAssets = {
  styles        : basePath.src + 'stylesheets/',
  scripts       : basePath.src + 'scripts/',
  vendorScripts : basePath.src + 'scripts/vendors/',
  images        : basePath.src + 'images/',
  svg           : basePath.src + 'svg/'
};

var distAssets = {
  styles        : basePath.dist + 'stylesheets/',
  scripts       : basePath.dist + 'scripts/',
  vendorScripts : basePath.dist + 'scripts/',
  images        : basePath.dist + 'images/',
  svg           : basePath.dist + 'svg/'
};

function errorAlert(err) {
  $.notify.onError({
    title: "Gulp Error",
    message: "Check your terminal",
    sound: "Basso"
  })(err);
  gutil.log(gutil.colors.red(err.toString()));
  this.emit("end");
}

gulp.task('build', ['styles', 'scripts', 'vendorScripts', 'images', 'svg'], function() {
  $.notify({
      title: "Assets built",
      message: "<%= file.relative %>",
      sound: "Glass"
  });
});

gulp.task('default', function() {
  gulp.watch(srcAssets.styles + '**/*', ['styles']);
  gulp.watch(srcAssets.scripts + '*', ['scripts']);
  gulp.watch(srcAssets.vendorScripts + '**/*', ['vendorScripts']);
  gulp.watch(srcAssets.images + '**/*', ['images']);
  gulp.watch(srcAssets.svg + '**/*', ['svg']);
});

gulp.task('styles', function() {
  return gulp.src(srcAssets.styles + 'main.scss')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.sass({
      precision: 6
    }))
    .pipe($.autoprefixer({
      browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Android >= 4']
    }))
    .pipe($.minifyCss())
    .pipe($.rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(distAssets.styles))
    .pipe($.notify({
        title: "Stylesheets recompiled",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('scripts', function() {
  return gulp.src(srcAssets.scripts + '*.js')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.jshint())
    .pipe($.jshint.reporter('jshint-stylish'))
    .pipe($.concat('main.js'))
    .pipe($.uglify())
    .pipe($.rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(distAssets.scripts))
    .pipe($.notify({
        title: "Scripts recompiled",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('vendorScripts', function() {
  return gulp.src(srcAssets.vendorScripts + '**/*.js')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.concat('vendors.js'))
    .pipe($.uglify())
    .pipe($.rename({
      suffix: ".min"
    }))
    .pipe(gulp.dest(distAssets.vendorScripts))
    .pipe($.notify({
        title: "Vendor scripts recompiled",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('images', function() {
  return gulp.src(srcAssets.images + '**/*')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.changed(distAssets.images))
    .pipe($.imagemin({
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(distAssets.images))
    .pipe($.notify({
        title: "Images optimized",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});

gulp.task('svg', function() {
  return gulp.src(srcAssets.svg + '*')
    .pipe($.plumber({errorHandler: errorAlert}))
    .pipe($.changed(distAssets.svg))
    .pipe($.imagemin())
    .pipe($.svgstore({ fileName: 'sprite.svg', prefix: 'icon-' }))
    .pipe(gulp.dest(distAssets.svg))
    .pipe($.notify({
        title: "SVGs optimized",
        message: "<%= file.relative %>",
        sound: "Glass"
    }));
});
