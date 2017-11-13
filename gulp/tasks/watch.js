const 	gulp = require('gulp'),
		watch = require('gulp-watch'), // importowanie gulp-watch
		browserSync = require('browser-sync').create(); //importujemy tylko metodę create 

gulp.task('watch', function(){

	// wskazanie browserSync gdzie znajduje się strona
	browserSync.init({
		server: {
			baseDir: "app"
		}
	});

	// odświeżanie strony po zmianach index.html
	watch('./app/index.html', function(){
		console.log("Zmiana index");
		browserSync.reload();
	});

	// obserwowanie wszystkich plików css z folderu /app/assets/styles i w przypadku zmiany wykonanie funkcji 
	// - tutaj uruchomienie zadania styles
	watch('./app/assets/styles/**/*.css', function(){
		gulp.start('cssInject');
	});

	// obserwowanie wszystkich zmian plików js i generowanie App.js za pomocą webpacka
	watch('./app/assets/scripts/**/*.js', function(){
		gulp.start('scriptsRefresh');
	});

	// automatyczne injectowanie stylów do strony, bez jej przeładowywania
	gulp.task('cssInject', ['styles'], function(){
		return gulp.src('./app/temp/styles/styles.css')
            .pipe(browserSync.stream());
	});

	// odświeżanie przeglądarki - po wykonaniu zadania scripts (uruchamiającego webpack)
	gulp.task('scriptsRefresh', ['scripts', 'owlcarousel'], function(){
		browserSync.reload();
	});

});
