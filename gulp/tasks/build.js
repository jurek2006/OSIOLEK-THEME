const   gulp = require('gulp'),
        imagemin = require('gulp-imagemin'),
        del = require('del'),
        usemin = require('gulp-usemin'),
        rev = require('gulp-rev'),
        cssnano = require('gulp-cssnano'),
        uglify = require('gulp-uglify'),
        browserSync = require('browser-sync').create(); //importujemy tylko metodę create

// zadanie pokazujące stronę z folderu docs w przeglądarce
gulp.task('previewDist', function(){
    browserSync.init({
        notify: false,
        server: {
            baseDir: "docs"
        }
    });
});

// zadanie usuwające cały folder docs
gulp.task('deleteDistFolder', function(){
    return del('./docs');
});

// zadanie uniwersalne do kopiowania (pozostałych) folderów
gulp.task('copyGeneralFiles', ['deleteDistFolder', 'styles', 'scripts'], function(){
    const pathsToCopy = [
        './app/**/*',
        '!./app/index.html',
        '!./app/assets/images/**',
        '!./app/assets/styles/**',
        '!./app/assets/scripts/**',
        '!./app/temp',
        '!./app/temp/**'
    ]

    return gulp.src(pathsToCopy)
        .pipe(gulp.dest("./docs"));
});

// zadanie kopiujące niezbędne obrazy do folderu /docs oraz kompresujące te obrazy
gulp.task('optimizeImages', ['deleteDistFolder'], function(){
    // wykrzyknika (!) możemy poniżej użyć do wyłączenia określonych plików z kopiowania

    return gulp.src(['./app/assets/images/**/*'])
        // kompresowanie obrazów:
        .pipe(imagemin({
            progressive: true,
            interlaced: true,
            multipass: true
        }))
        // kopiowanie obrazów do docs:
        .pipe(gulp.dest('./docs/assets/images'));
});

// zadanie uruchamiające usemin po zakończeniu deleteDistFolder
gulp.task('useminTrigger', ['deleteDistFolder'], function(){
    gulp.start("usemin");
});

// zadanie kopiowania, kompresowania i dodawania indywidualnego kodu wersji dla plików js i css
gulp.task('usemin', ['deleteDistFolder'], function(){
    return gulp.src("./app/index.html")
        .pipe(usemin({
            css: [function () { return rev()}, function() {return cssnano()}],
            js: [function(){ return rev()}, function(){return uglify() }]
        }))
        .pipe(gulp.dest('./docs'));
});

// zadanie główne (build) tworzące wersję strony do dystrybucji (używany folder docs wymagany przez GitHub pages)
gulp.task('build', ['deleteDistFolder', 'copyGeneralFiles', 'optimizeImages', 'useminTrigger']);