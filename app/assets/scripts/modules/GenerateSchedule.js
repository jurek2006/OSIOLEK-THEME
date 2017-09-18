// generowanie repertuaru w celach testowych - projektowych
// aktualnie repertuar generowany jest dla wszystkich dni zdefiniowanych w index.html - jednocześnie wszystkie "zadane" dni są wypełniane treścią - mimo, że wyświetlany jest tylko jeden bieżący

class GenerateSchedule{
	constructor(){
		const schedule = new Schedule();

		console.log(schedule);

		this.fillScheduleHTML(schedule);
	}

	fillScheduleHTML(schedule){
	// wypełnia poszczególne dni w repertuarze zdefiniowanymi projekcjami

		// znajdź wszystkie elementy (article.movieSchedule__ofDay) dni repertuaru
		const daySchedulesArr = document.querySelectorAll('.movieSchedule__ofDay');

		// dla każdego dnia w repertuarze (wg zdefiniowanych sekcji w index.html)
		daySchedulesArr.forEach(function(currDayEl){

			// pobierz wartość atrybutu dayAttr dla aktualnego dnia
			const day = currDayEl.getAttribute('day');

			// pobranie repertuaru dla danego dnia [Jako tablica Movies]
			const scheduleOfDay = schedule.getScheduleOfDay(day);

			if(scheduleOfDay !== undefined){
			// jeśli został zdefiniowany dzień w schedule
				console.log(scheduleOfDay);

				// iteracja po wszystkich filmach (obiektach) obiektu scheduleOfDay (obiektu repertuaru na dany dzień)
				for (let currMovie in scheduleOfDay) {
					// pomijamy obiekt, jeśli pochodzi z prototypu
					if(!scheduleOfDay.hasOwnProperty(currMovie)) continue;

						// currMovie jest tutaj tylko nazwą obiektu (czyli filmu, np. anabelle) - podstawiamy jako currMovie obiekt filmu
						currMovie = scheduleOfDay[currMovie];

						// utworzenie etykiety dnia z daty (day) w formacie 1 wrz
						let dayLabel = new Date(day);
						let formatter = new Intl.DateTimeFormat("pl", { month: "short", day: 'numeric' });
						dayLabel = formatter.format(dayLabel);

						// template movieBox - repertuaru konkretnego filmu w danym dniu
						let movieBoxTemplate = '<section class="movieBox"><h2 class="movieBox__tytul">%%title%%</h2> <img class="movieBox__plakat" src="%%image%%" alt="Plakat filmu - %%title%%."> <p class="movieBox__info"><span class="movieBox__etykieta--ukryte">Czas trwania: </span>%%runtime%%</p> <p class="movieBox__info"><span class="movieBox__etykieta--ukryte">Kategoria wiekowa: </span>%%ageCat%%</p> <p class="movieBox__info"><span class="movieBox__etykieta--ukryte">Gatunek: </span>%%genre%%</p> <div class="movieBox__seanseDnia"><p>Seanse w dniu %%currDayLabel%%:</p> %%currDayProjections%% </div> <button href="#" class="btn movieBox__zobaczWszystkie">Zobacz wszystkie seanse</button> <div class="movieBox__wszystkieSeanse movieBox__wszystkieSeanse--initUkryty"> <h3>Seanse w dniu 1 wrz:</h3> <button class="btn btn--seans"> 2D dubbing 16:00</button> <button class="btn btn--seans"> 3D dubbing 18:00</button> <h3>Seanse w dniu 2 wrz:</h3> <button class="btn btn--seans"> 2D dubbing 16:00</button> </div>	</section>';

						// wypełnienie powyższego template danymi filmu
						movieBoxTemplate = movieBoxTemplate.replace('%%title%%', currMovie.title);
						movieBoxTemplate = movieBoxTemplate.replace('%%image%%', currMovie.image);
						movieBoxTemplate = movieBoxTemplate.replace('%%runtime%%', currMovie.runtime);
						movieBoxTemplate = movieBoxTemplate.replace('%%ageCat%%', currMovie.ageCat);
						// Movie.genre jest tablicą gatunków filmowych - więc łączymy je w jeden string
						movieBoxTemplate = movieBoxTemplate.replace('%%genre%%', currMovie.genre.join(' | '));
						movieBoxTemplate = movieBoxTemplate.replace('%%currDayLabel%%', dayLabel);

						// pobranie projekcji danego filmu w danym dniu - generowanie buttons dla każdej takiej projekcji
						let generatedProjBtns = '';
						// iteracja po wszystkich projekcjach filmu w danym dniu
						// (przykład obiektu Movie: anabelle.projections.2017-09-01 - iterujemy po obiektach tego obiektu)
						for (let currProjectionHour in currMovie.projections[day]) {
							let generatedBtn = '<button class="btn btn--seans"> %%ifProj3d%% %%projLangVer%% %%projHour%%</button>';

							// skip loop if the currMovieerty is from prototype
							if(!currMovie.projections[day].hasOwnProperty(currProjectionHour)) continue;

							const currProjectionData = currMovie.projections[day][currProjectionHour];
							generatedBtn = generatedBtn.replace('%%projHour%%', currProjectionHour);
							generatedBtn = generatedBtn.replace('%%projLangVer%%', currProjectionData.languageVer);
							generatedBtn = generatedBtn.replace('%%ifProj3d%%', currProjectionData.if3d ? '3D' : '2D');

							// dodanie wygenerowanego buttona do wszystkich buttonów
							generatedProjBtns += generatedBtn; 
						}
						
						// wstawianie wygenerowanych buttons do szablonu movieBox
						movieBoxTemplate = movieBoxTemplate.replace('%%currDayProjections%%', generatedProjBtns);

						// wstawianie całego wygenerowanego movieBox dla danego filmu do DOM (repertuaru odpowiedniego dnia)
						currDayEl.insertAdjacentHTML('beforeend', movieBoxTemplate);
				}
			}
		});

	}
}

class Schedule{
	constructor(){
		// this.movies = movies;
		this.movies = new MoviesDB().movies;
		this.schedule = {};
		this.generateScheduleData();
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
				this.schedule[day] = {};
			}

			// dodanie w schedule do pola dnia referencji do obiektu filmu (czyli np. this.schedule.2017-09-01 otrzymuje pole anabelle [Obiekt Movie])
			// w tym przypadku nie ma znaczenia czy dany film juz się tam znajduje - w takim przypadku przypisany zostanie ten sam obiekt
			this.schedule[day][movieSlug] = movieObj;

		} else {
			console.log(movieSlug + " nie jest poprawnym slug'iem filmu w Schedule.addProjection() [GenerateSchedule.js]");
		}
	}

	generateScheduleData(){
		// -----------------------------------------------------------------
		// TUTAJ DOPISUJEMY PROJEKCJE - DANE TESTOWE
		this.addProjection('2017-09-01', 'anabelle', '12:00', false, 'dubbing');
		this.addProjection('2017-09-01', 'bodyguard', '15:00', false, 'dubbing');
		this.addProjection('2017-09-01', 'bodyguard', '20:00', true, 'napisy');
		this.addProjection('2017-09-01', 'o-czym-szumi-las', '18:00', false, 'dubbing');

		this.addProjection('2017-09-02', 'bodyguard', '10:00', false, 'dubbing');

	}

	getScheduleOfDay(day){
	// zwraca repertuar dla danego dnia
		// console.log('getScheduleOfDay dla dnia: ' + day); TESTOWE

		// Zwrócenie schedule dla dnia day
		return this.schedule[day];
	}
}

class MoviesDB{
	constructor(){
		this.movies = {};
		this.generateDB();
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

// Zrefaktoryzować przedewszystkim "forEach" po obiektach obiektu, funkcję fillScheduleHTML