const 	gulp = require('gulp'),
		watch = require('gulp-watch'), // importowanie gulp-watch
		postcss = require('gulp-postcss'), //importowanie PostCSS
		autoprefixer = require('autoprefixer'),
		cssvars = require('postcss-simple-vars'),
		nested = require('postcss-nested');

// domyślne zadanie TEST
gulp.task('default', function(){
	console.log("gulp działa");
});

//zadanie styles
gulp.task('styles', function(){
	return gulp.src('./app/assets/styles/styles.css')
			.pipe(postcss([cssvars, nested, autoprefixer]))
			.pipe(gulp.dest('./app/temp/styles'));
});

gulp.task('watch', function(){
	// obserwowanie wszystkich plików css z folderu /app/assets/styles i w przypadku zmiany wykonanie funkcji 
	// - tutaj uruchomienie zadania styles
	watch('./app/assets/styles/**/*.css', function(){
		gulp.start('styles');
	});
});