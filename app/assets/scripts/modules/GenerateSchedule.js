// generowanie repertuaru w celach testowych - projektowych

class GenerateSchedule{
	constructor(){
		const moviesDB = new MoviesDB();
		moviesDB.generateDB();

		const schedule = new Schedule(moviesDB.movies);
		schedule.generateSchedule();

		console.log(schedule);
	}
}

class Schedule{
	constructor(movies){
		this.movies = movies;
		this.schedule = {};
	}

	addProjection(day, movieSlug, time, if3d, languageVer, specProjLabel){
	// dodaje projekcję dla filmu (w dniu day, film o movieSlug)
		
		// sprawdzenie czy istnieje film o podanym slug w movies (zdefiniowanej bazie filmów)
		const movieObj = this.movies[movieSlug];
		if(movieObj !== undefined && movieObj !== null){
		// jeśli znaleziono odpowiedni film, dodanie do niego projekcji i dodanie referencji do filmu do schedule dla danego dnia

			movieObj.addProjection(day, time, if3d, languageVer, specProjLabel);

			// sprawdzenie czy dla danego dnia jest już jakaś projekcja (jeśli nie, to trzeba dla niego utworzyć pustą tablicę)
			if(this.schedule[day] === undefined || this.schedule[day] === null){
				this.schedule[day] = [];
			}
			// dodanie w schedule do pola dnia referencji do obiektu filmu
			this.schedule[day].push(movieObj);

		} else {
			console.log(movieSlug + " nie jest poprawnym slug'iem filmu w Schedule.addProjection() [GenerateSchedule.js]");
		}
	}

	generateSchedule(){
		this.addProjection('2017-09-01', 'anabelle', '12:00', false, 'dubbing');
		this.addProjection('2017-09-01', 'bodyguard', '15:00', false, 'dubbing');
		this.addProjection('2017-09-01', 'bodyguard', '20:00', true, 'napisy');
	}
}

class MoviesDB{
	constructor(){
		this.movies = {}
	}

	addMovie(slug, title, image, runtime, ageCat, genre, specialLabel){
	// metoda dodająca film do bazy (this.movies)
		this.movies[slug] = new Movie( slug, title, image, runtime, ageCat, genre, specialLabel);
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

class Movie{
	constructor(slug, title, image, runtime, ageCat, genre, specialLabel){
		this.slug = slug;
		this.title = title;
		this.image = image;
		this.runtime = runtime;
		this.ageCat = ageCat;
		this.genre = genre;
		this.projections = {};
		this.specialLabel = specialLabel;
	}

	addProjection(day, time, if3d, languageVer, specProjLabel){

		// sprawdzenie czy są już projekcje dla danego dnia - jeśli nie to trzeba utworzyć dla niego puste pole
		if(this.projections[day] === undefined || this.projections[day] === null){
			this.projections[day] = {};
		}
		this.projections[day][time] = {	'if3d': if3d,
										'languageVer': languageVer,
										'specProjLabel': specProjLabel};
	}
}


export default GenerateSchedule;