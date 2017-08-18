const 	gulp = require('gulp'),
		postcss = require('gulp-postcss'), //importowanie PostCSS
		autoprefixer = require('autoprefixer'),
		cssvars = require('postcss-simple-vars'),
		nested = require('postcss-nested'),
		cssImport = require('postcss-import');

// zadanie styles
gulp.task('styles', function(){
	return gulp.src('./app/assets/styles/styles.css')
			.pipe(postcss([cssImport, cssvars, nested, autoprefixer]))
			.pipe(gulp.dest('./app/temp/styles'));
});