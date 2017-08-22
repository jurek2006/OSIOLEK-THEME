const 	gulp = require('gulp'),
		webpack = require('webpack');

gulp.task('scripts', function(callback) {
	// ścieżka do webpacka względem tego pliku scripts.js (wnętrza folderu tasks)
	webpack(require('../../webpack.config.js'), function(){
		console.log("Webpack completed");
		callback();	
	});
});