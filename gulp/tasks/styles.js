const 	gulp = require('gulp'),
		postcss = require('gulp-postcss'), //importowanie PostCSS
		autoprefixer = require('autoprefixer'),
		cssvars = require('postcss-simple-vars'),
		nested = require('postcss-nested'),
		cssImport = require('postcss-import'),
		mixins = require('postcss-mixins'),
		hexrgba = require('postcss-hexrgba');

// zadanie styles
gulp.task('styles', function(){
	return gulp.src('./app/assets/styles/styles.css')
			.pipe(postcss([cssImport, mixins, cssvars, nested, hexrgba, autoprefixer]))
			.on('error', function(){
				this.emit('end');
			})
			.pipe(gulp.dest('./app/temp/styles'));
});