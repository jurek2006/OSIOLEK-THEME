const	gulp = require('gulp'),
		modernizr = require('gulp-modernizr');

// zadanie modernizr generujące plik modernizr.js w ./app/temp/scripts/
gulp.task('modernizr', function(){

	return gulp.src(['./app/assets/styles/**/*.css', './app/assets/scripts/**/*.js'])
			.pipe(modernizr({
				"options": [
					"setClasses"
				]
			}))
			.pipe(gulp.dest('./app/temp/scripts/'));

});