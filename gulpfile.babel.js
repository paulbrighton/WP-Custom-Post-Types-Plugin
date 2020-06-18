import gulp from 'gulp'
import yargs from 'yargs'
import sass from 'gulp-sass'
import cleanCSS from 'gulp-clean-css'
import gulpif from 'gulp-if'
import sourcemaps from 'gulp-sourcemaps'
import imagemin from 'gulp-imagemin'
import del from 'del'
import webpack from 'webpack-stream'
import uglify from 'gulp-uglify'
import named from 'vinyl-named'
import zip from 'gulp-zip'
import replace from 'gulp-replace'
import info from './package.json'

const PRODUCTION = yargs.argv.prod

const paths = {
  styles: {
    src: ['src/assets/scss/main.scss'],
    dest: 'dist/assets/css'
  },
  images: {
    src: 'src/assets/images/**/*.{jpg,jpeg,png,svg,gif}',
    dest: 'dist/assets/images'
  },
  scripts: {
    src: ['src/assets/js/main.js'],
    dest: 'dist/assets/js'
  },
  plugins: {
    src: ['../../plugins/__themename-metaboxes/packaged/*'],
    dest: 'lib/plugins'

  },
  other: {
    src: ['src/assets/**/*', '!src/assets/{images,js,scss}', '!src/assets/{images,js,scss}/**/*'],
    dest: 'dist/assets'
  },
  package: {
    src: ['**/*', '!.vscode', '!node_modules{,/**}', '!packaged{,/**}', '!src{,/**}', '!.babelrc', '!.gitignore', '!gulpfile.babel.js', '!package.json', '!package-lock.json'],
    dest: 'packaged'
  }
}

export const clean = () => del(['dist'])

export const styles = () => {
  return gulp.src(paths.styles.src)
    .pipe(gulpif(!PRODUCTION, sourcemaps.init()))
    .pipe(sass().on('error', sass.logError))
    .pipe(gulpif(PRODUCTION, cleanCSS({compitability: 'ie8'})))
    .pipe(gulpif(!PRODUCTION, sourcemaps.write()))
    .pipe(gulp.dest(paths.styles.dest))
}

export const scripts = () => {
  return gulp.src(paths.scripts.src)
    .pipe(named())
    .pipe(webpack({
      module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
      },
      output: {
        filename: '[name].js'
      },
      externals: {
        jquery: 'jQuery'
      },
      devtool: !PRODUCTION ? 'inline-source-map' : false,
      mode: PRODUCTION ? 'production' : 'development'
    }))
    .pipe(gulpif(PRODUCTION, uglify()))
    .pipe(gulp.dest(paths.scripts.dest))
}

export const images = () => {
  return gulp.src(paths.images.src)
    .pipe(gulpif(PRODUCTION, imagemin()))
    .pipe(gulp.dest(paths.images.dest))
}

export const copy = () => {
  return gulp.src(paths.other.src)
    .pipe(gulp.dest(paths.other.dest))
}

export const copyPlugins = () => {
  return gulp.src(paths.plugins.src)
    .pipe(gulp.dest(paths.plugins.dest))
}

export const watch = () => {
  gulp.watch(['src/assets/scss/**/*.scss', 'includes/**/*.scss'], styles)
  gulp.watch(['src/assets/js/**/*.js', 'includes/**/*.js'], scripts)
  gulp.watch('**/*.php')
  gulp.watch(paths.images.src, images)
  gulp.watch(paths.other.src, copy)
}

export const compress = () => {
  return gulp.src(paths.package.src, {base: '../'})
    .pipe(replace('_pluginname', info.name))
    .pipe(replace('_themename', info.theme))
    .pipe(zip(`${info.theme}-${info.name.replace('_', '-')}.zip`))
    .pipe(gulp.dest(paths.package.dest))
}

export const dev = gulp.series(clean, watch)
export const build = gulp.series(clean)
export const bundle = gulp.series(build, compress)

export default dev
