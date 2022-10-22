let gulp = require('gulp');
let concat = require('gulp-concat');
let postcss = require('gulp-postcss');
let autoprefixer = require('gulp-autoprefixer');
let cleancss = require('gulp-clean-css');
let browserSync = require('browser-sync').create();
let cssnext = require('postcss-preset-env');
let uglify = require('gulp-uglify');
let cssnano = require('cssnano');

function refresh() {
	return gulp.src(['css/*.css'])
		.pipe(gulp.dest('css'))
		.pipe(browserSync.stream());
}

function css() {
	return gulp.src([
		'./css/*.css',
	])
		.pipe(cleancss())
		.pipe(concat('root.min.css'))
		.pipe(browserSync.stream())
		.pipe(autoprefixer({cascade: false}))
		.pipe(postcss([], [cssnano()]))
		.pipe(gulp.dest('dist/css/'));
}

function js() {
	return gulp.src([
		'js/*.js',
	])
		.pipe(uglify())
		.pipe(concat('root.min.js'))
		.pipe(gulp.dest('dist/js/'))
}

function serve() {
	browserSync.init({
		server: ''
	});
	gulp.watch('*.html').on('change', css, browserSync.reload);
	gulp.watch('./css/*.css').on('change', css, browserSync.reload);
	// gulp.watch('./js/*js').on('change', js, browserSync.reload);
	gulp.watch('./**/**/*').on('change', function () {
		console.log("Change detected");
		browserSync.reload();
	});
}

gulp.task('default', gulp.series(serve, css, js))
gulp.task('build', gulp.series(css,js))
gulp.task('css', gulp.series(css))
gulp.task('js', gulp.series(js))
