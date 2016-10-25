import project from '../aurelia.json';
import gulp from 'gulp';
import to5 from 'gulp-babel';
import plumber from 'gulp-plumber';
import del from 'del';
import gulpProtractor from 'gulp-protractor';

const webdriverUpdate = gulpProtractor.webdriver_update;
const webdriverStandalone = gulpProtractor.webdriver_standalone;
const protractor = gulpProtractor.protractor;

const globs = {
  src:  project.paths.tests.e2e + '/src/**/*.js',
  dist: project.paths.tests.e2e + '/dist'
}

// for full documentation of gulp-protractor,
// please check https://github.com/mllrsohn/gulp-protractor
gulp.task('webdriver-update', webdriverUpdate);
gulp.task('webdriver-standalone', gulp.series('webdriver-update', webdriverStandalone));

gulp.task('clean-e2e', () => del(globs.dist + '*'));

// transpiles files in
// /test/e2e/src/ from es6 to es5
// then copies them to test/e2e/dist/
gulp.task('build-e2e', gulp.series('clean-e2e', () => {
  return gulp.src(globs.src)
             .pipe(plumber())
             .pipe(to5())
             .pipe(gulp.dest(globs.dist));
}));

// runs build-e2e task
// then runs end to end tasks
// using Protractor: http://angular.github.io/protractor/
export default gulp.series('build-e2e', () => {
  return gulp.src(globs.dist + '**/*.js')
             .pipe(protractor({
               configFile: 'protractor.conf.js',
               args: ['--baseUrl', 'http://127.0.0.1:9000']
             }))
             .on('end', function() { process.exit(); })
             .on('error', function(e) { throw e; });
});
