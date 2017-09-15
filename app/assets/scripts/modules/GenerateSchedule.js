// generowanie repertuaru w celach testowych - projektowych

class GenerateSchedule{
	constructor(){
		const moviesDB = new MoviesDB();
		moviesDB.generateDB();
		moviesDB.console();

	}
}

class MoviesSchedule{
	constructor(){

	}
}

class MoviesDB{
	constructor(){
		this.movies = {}
	}

	addMovie(slug, title, image, runtime, ageCat, genre, projections, specialLabel){
	// metoda dodająca film do bazy (this.movies)
		this.movies[slug] = new MovieBox( slug, title, image, runtime, ageCat, genre, projections, specialLabel);
	}

	generateDB(){
	// metoda generująca zawartość obiektu przechwującego wszystkie filmy

		// -----------------------------------------------------------------
		// TUTAJ DOPISUJEMY FILMY - DANE TESTOWE
		this.addMovie(	'o-czym-szumi-las', 
						'O czym szumi las', 
						'/assets/images/moviesImages/oCzymSzumiLas.jpg',
						'75 min',
						'b/o',
						['Animowany', 'Familijny'], 
						'',
						'');

		this.addMovie(	'anabelle', 
						'Anabelle: Narodziny zła', 
						'/assets/images/moviesImages/anabelle.jpg',
						'109 min',
						'od 15 lat',
						['Horror'], 
						'',
						'');

		this.addMovie(	'bodyguard', 
						'Bodyguard Zawodowiec', 
						'/assets/images/moviesImages/bodyguardZawodowiec.jpg',
						'118 min',
						'od 15 lat',
						['Akcja', 'Komedia'], 
						'',
						'');
	}

	// testowe
	console(){
		console.log(this.movies);
	}
}

class MovieBox{
	constructor(slug, title, image, runtime, ageCat, genre, projections, specialLabel){
		this.slug = slug;
		this.title = title;
		this.image = image;
		this.runtime = runtime;
		this.ageCat = ageCat;
		this.genre = genre;
		this.projections = projections;
		this.specialLabel = specialLabel;
	}
}


export default GenerateSchedule;