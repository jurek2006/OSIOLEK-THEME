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
		const daySchedulesArr = [...document.querySelectorAll('.movieSchedule__ofDay')];

		// dla każdego dnia w repertuarze (wg zdefiniowanych sekcji w index.html)
		daySchedulesArr.forEach(function(currDayEl){

			// pobierz wartość atrybutu dayAttr dla aktualnego dnia
			const day = currDayEl.getAttribute('day');

			// pobranie repertuaru dla danego dnia [Jako tablica Movies]
			const scheduleOfDay = schedule.getScheduleOfDay(day);

			if(scheduleOfDay !== undefined){
			// jeśli został zdefiniowany dzień w schedule

				// iteracja po wszystkich filmach (obiektach) obiektu scheduleOfDay (obiektu repertuaru na dany dzień)
				for (let currMovie in scheduleOfDay) {
					// pomijamy obiekt, jeśli pochodzi z prototypu
					if(!scheduleOfDay.hasOwnProperty(currMovie)) continue;

						// currMovie jest tutaj tylko nazwą obiektu (czyli filmu, np. anabelle) - podstawiamy jako currMovie obiekt filmu
						currMovie = scheduleOfDay[currMovie];

						// utworzenie etykiety dnia z daty (day) w formacie 1 wrz
						let dayLabel = 'xxx';
						try{
							dayLabel = new Date(day);
							let formatter = new Intl.DateTimeFormat("pl", { month: "short", day: 'numeric' });
							dayLabel = formatter.format(dayLabel);
						} catch(err){
							console.error(err);
						}

						// template movieBox - repertuaru konkretnego filmu w danym dniu
						let movieBoxTemplate = 
						`<section class="movieBox group"> 
							<header class="movieBox__header">
								%%movieLabel%%
								<h2 class="movieBox__title centerContent"><span>%%title%%</span></h2> 
							</header>
							<img class="movieBox__poster" src="%%image%%" alt="Plakat filmu - %%title%%."> 
							<button class="movieBox__aboutBtn btn btn--dark btn--hovColor btn--rounded btn--aboutMovie">O filmie</button>   	
							<div class="movieBox__infoBox">
								<p class="movieBox__info movieBox__info--runtime">
									<span class="movieBox__lbl visually-hidden">Czas trwania: </span>%%runtime%% |
								</p> 
								<p class="movieBox__info movieBox__info--ageCat">
									<span class="movieBox__lbl visually-hidden">Kategoria wiekowa: </span>%%ageCat%% |
								</p> 
								<p class="movieBox__info movieBox__info--genre">
									<span class="movieBox__lbl visually-hidden">Gatunek: </span>%%genre%%
								</p> 
							</div>
							<section class="movieBox__projections"> 
								<header><h3 class="movieBox__projectionsHeading">Seanse w dniu %%currDayLabel%%:</h3></header> 
								<span class="movieBox__pickProjectionLbl movieBox__pickProjectionLbl--hidden">Wybierz seans:</span> 
								<ul> %%currDayProjections%% </ul> 
							</section>
							<button href="#" class="movieBox__allProjections btn btn--light btn--transparent btn--hovColor btn--seeAllProjections">Zobacz wszystkie seanse</button> 
						</section>`;

						// wypełnienie powyższego template danymi filmu
						movieBoxTemplate = movieBoxTemplate.replace('%%title%%', currMovie.title);
						movieBoxTemplate = movieBoxTemplate.replace('%%title%%', currMovie.title); //PROWIZORYCZNE - poprawić
						movieBoxTemplate = movieBoxTemplate.replace('%%image%%', currMovie.image);
						movieBoxTemplate = movieBoxTemplate.replace('%%runtime%%', currMovie.runtime);
						movieBoxTemplate = movieBoxTemplate.replace('%%ageCat%%', currMovie.ageCat);
						// Movie.genre jest tablicą gatunków filmowych - więc łączymy je w jeden string
						movieBoxTemplate = movieBoxTemplate.replace('%%genre%%', currMovie.genre.join(' | '));
						movieBoxTemplate = movieBoxTemplate.replace('%%currDayLabel%%', dayLabel);

						// generowanie i wstawianie do szablonu etykiety filmu (są w tablicy, może ich być więcej niż 1 - ale używamy tylko jednej - pierwszej)
						if(currMovie.movieLabelsArr !== undefined && currMovie.movieLabelsArr.length > 0){
							movieBoxTemplate = movieBoxTemplate.replace('%%movieLabel%%', `<span class="movieBox__label label label--movie centerContent"><span>${currMovie.movieLabelsArr[0]}</span></span>`);
						} else {
							movieBoxTemplate = movieBoxTemplate.replace('%%movieLabel%%','');
						}
						// movieBoxTemplate = movieBoxTemplate.replace('%%movieLabels%%', () => {
						// 	// ZREFAKTORYZOWAĆ
						// 	let labels = '';
						// 	if(currMovie.movieLabelsArr !== undefined && currMovie.movieLabelsArr.length > 0){
						// 	// jeśli zdefiniowano tablicę etykiet dla filmu i jest w niej przynajmniej 1 element placeholder %%movieLabel%% zastępowany jest etykietami (w span) - jeśli nie, od razu zwracany jest pusty string
						// 	// etykiety są w div.movieBox__movieLabels (jeśli nie ma żadnej to jego też nie ma)

						// 		labels += '<div class="movieBox__movieLabels">';

						// 		currMovie.movieLabelsArr.forEach(currLabel => {
						// 			labels += `<span class="label label--movie">${currLabel}</span>`;
						// 		});

						// 		labels += '</div>';
						// 	}
						// 	return labels;
						// });

						// pobranie projekcji danego filmu w danym dniu - generowanie buttons dla każdej takiej projekcji
						let generatedProjBtns = '';
						// iteracja po wszystkich projekcjach filmu w danym dniu
						// (przykład obiektu Movie: anabelle.projections.2017-09-01 - iterujemy po obiektach tego obiektu)
						for (let currProjectionHour in currMovie.projections[day]) {
							let generatedBtn = 
							`<li> 
								<button class="btn btn--light btn--transparent btn--projection" data-visualTicketID="%%vtID%%"> 
									%%specProjLabels%% 
									<span class="btn--projection__hour">%%projHour%%</span> 
									<span class="btn--projection__info">%%ifProj3d%% %%projLangVer%%</span>   
								</button>
							</li>`;

							// skip loop if the currMovieerty is from prototype
							if(!currMovie.projections[day].hasOwnProperty(currProjectionHour)) continue;

							const currProjectionData = currMovie.projections[day][currProjectionHour];
							generatedBtn = generatedBtn.replace('%%vtID%%', currProjectionData.visualTicketID);
							generatedBtn = generatedBtn.replace('%%projHour%%', currProjectionHour);
							generatedBtn = generatedBtn.replace('%%projLangVer%%', currProjectionData.languageVer);
							generatedBtn = generatedBtn.replace('%%ifProj3d%%', currProjectionData.if3d ? '3D' : '2D');

							// dodanie ewentualnej etykiety do projekcji (może być tylko jedna, mimo iż są w tablicy - ale wyświetlana będzie tylko jedna)

							generatedBtn = generatedBtn.replace('%%specProjLabels%%', () => {

								if(currProjectionData.specProjLabelArr !== undefined && currProjectionData.specProjLabelArr.length > 0){
									// jeśli ustawiona jest właściwość etykiet projekcji (i jest przynajmniej jedna)
									// to jest ta etykieta wyświetlana
									return `<span class="btn--projection__lbl">${currProjectionData.specProjLabelArr[0]}</span>`;
								} else {
									// jeśli nie ma żadnej etykiety dla projekcji to dodawany jest "placeholder" (ukrywany później stylami, ale tak, żeby zajmował miejsce)
									return '<span class="btn--projection__lbl btn--projection__lbl--none">Kup bilet</span>';
								}

							});

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

	addProjection(day, movieSlug, time, visualTicketID, if3d, languageVer, specProjLabelArr){
	// dodaje projekcję dla filmu (w dniu day, film o movieSlug)
		
		// sprawdzenie czy istnieje film o podanym slug w movies (zdefiniowanej bazie filmów)
		const movieObj = this.movies[movieSlug];
		if(movieObj !== undefined && movieObj !== null){
		// jeśli znaleziono odpowiedni film, dodanie do niego projekcji i dodanie referencji do filmu do schedule dla danego dnia

			movieObj.addProjection(day, time, visualTicketID, if3d, languageVer, specProjLabelArr);

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
		this.addProjection('2017-09-01', 'anabelle', '12:00', 1001, false, 'dubbing', ['seans kinomana']);
		this.addProjection('2017-09-01', 'bodyguard', '15:00', 1001, false, 'dubbing');
		this.addProjection('2017-09-01', 'bodyguard', '20:00', 1001, true, 'napisy');
		this.addProjection('2017-09-01', 'o-czym-szumi-las', '18:00', 1001, false, 'dubbing');
		this.addProjection('2017-09-01', 'fantastyczne-zwierzeta', '10:00', 1001, false, 'dubbing');
		this.addProjection('2017-09-01', 'vaiana', '10:00', 1001, true, 'dubbing');
		this.addProjection('2017-09-01', 'vaiana', '12:00', 1001, false, 'audiodeskrypcja');
		this.addProjection('2017-09-01', 'lotr1', '8:00', 1001, true, 'dubbing');
		this.addProjection('2017-09-01', 'lotr1', '10:00', 1001, false, 'napisy');
		this.addProjection('2017-09-01', 'lotr1', '8:00', 1001, true, 'dubbing');
		this.addProjection('2017-09-01', 'lotr1', '10:00', 1001, false, 'napisy');
		this.addProjection('2017-09-01', 'lotr1', '12:00', 1001, true, 'dubbing');
		this.addProjection('2017-09-01', 'lotr1', '14:00', 1001, false, 'napisy');
		this.addProjection('2017-09-01', 'lotr1', '16:00', 1001, true, 'dubbing');
		this.addProjection('2017-09-01', 'lotr1', '18:00', 1001, false, 'napisy');
		this.addProjection('2017-09-01', 'mother', '22:00', 1001, false, 'audiodeskrypcja');
		this.addProjection('2017-09-01', 'to', '0:00', true, 1001, 'lektor');

		this.addProjection('2017-09-02', 'mother', '10:00', false, 1001, 'na żywo', ['maraton filmowy']);

		this.addProjection('2017-09-03', 'vaiana', '10:00', false, 1001, 'napisy', ['filmowy poranek']);
		this.addProjection('2017-09-03', 'lotr1', '8:00', true, 1001, 'dubbing');

		this.addProjection('2017-09-05', 'o-czym-szumi-las', '18:00', 1001, false, 'dubbing');
		this.addProjection('2017-09-05', 'o-czym-szumi-las', '21:00', 1001, true, 'dubbing');
		this.addProjection('2017-09-05', 'fantastyczne-zwierzeta', '10:00', 1001, false, 'dubbing');
		this.addProjection('2017-09-05', 'fantastyczne-zwierzeta', '12:00', 1001, false, 'dubbing');
		this.addProjection('2017-09-05', 'fantastyczne-zwierzeta', '16:00', 1001, false, 'dubbing');
		this.addProjection('2017-09-05', 'vaiana', '10:00', 1001, true, 'napisy');
		this.addProjection('2017-09-05', 'vaiana', '10:00', 1001, true, 'napisy');
		this.addProjection('2017-09-05', 'vaiana', '11:00', 1001, true, 'napisy');
		this.addProjection('2017-09-05', 'vaiana', '12:00', 1001, true, 'napisy');
		this.addProjection('2017-09-05', 'vaiana', '13:00', 1001, true, 'napisy');

		this.addProjection('2017-09-06', 'lotr1', '7:00', 1001, false, 'dubbing');
		this.addProjection('2017-09-06', 'mother', '10:00', 1001, false, 'dubbing', ['filmowy poranek']);
		this.addProjection('2017-09-06', 'vaiana', '10:00', 1001, true, 'napisy', ['filmowy poranek']);
		this.addProjection('2017-09-06', 'vaiana', '12:00', 1001, false, 'napisy');
		this.addProjection('2017-09-06', 'vaiana', '14:00', 1001, true, 'napisy');
		this.addProjection('2017-09-06', 'vaiana', '16:00', 1001, true, 'napisy');

		this.addProjection('2017-09-07', 'anabelle', '12:00', 1001, false, 'dubbing');
		this.addProjection('2017-09-07', 'bodyguard', '15:00', 1001, false, 'dubbing');
		this.addProjection('2017-09-07', 'bodyguard', '20:00', 1001, true, 'napisy', ['kino seniora', 'kinomaniak'] );
		this.addProjection('2017-09-07', 'o-czym-szumi-las', '18:00', 1001, false, 'dubbing');
		this.addProjection('2017-09-07', 'vaiana', '14:00', 1001, true, 'napisy');

	}

	getScheduleOfDay(day){
	// zwraca repertuar dla danego dnia

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
						'assets/images/moviesImages/oCzymSzumiLas.jpg',
						'75 min',
						'b/o',
						['Animowany', 'Familijny']
						);

		this.addMovie(	'anabelle', 
						'Anabelle: Narodziny zła', 
						'assets/images/moviesImages/anabelle.jpg',
						'109 min',
						'od 15 lat',
						['Horror']
						);

		this.addMovie(	'bodyguard', 
						'Bodyguard Zawodowiec', 
						'assets/images/moviesImages/bodyguardZawodowiec.jpg',
						'118 min',
						'od 15 lat',
						['Akcja', 'Komedia']
						);

		this.addMovie(	'fantastyczne-zwierzeta', 
						'Fantastyczne zwierzęta i jak je znaleźć', 
						'assets/images/moviesImages/fantastyczne-zwierzeta.jpg',
						'118 min',
						'od 7 lat',
						['Przygodowy', 'Familijny', 'Fantasy'],
						['Seans kinomana']
						);

		this.addMovie(	'vaiana', 
						'Vaiana: Skarb oceanu', 
						'assets/images/moviesImages/vaiana.jpg',
						'107 min',
						'b/o',
						['Przygodowy', 'Komedia', 'Animacja']
						);

		this.addMovie(	'to', 
						'To', 
						'assets/images/moviesImages/to.jpg',
						'145 min',
						'od 18 lat',
						['Horror', 'Dramat']
						);

		this.addMovie(	'lotr1', 
						'Łotr 1. Gwiezdne wojny - historie', 
						'assets/images/moviesImages/lotr1.jpg',
						'113 min',
						'od 13 lat',
						['Sci-F', 'Przygodowy'],
						['Star Wars Zone', 'Etykieta beznazwowa']);

		this.addMovie(	'mother', 
						'Mother!', 
						'assets/images/moviesImages/mother.jpg',
						'121 min',
						'od 18 lat',
						['Dramat', 'Horror'],
						['Kino filmowego kosmity']);
	}

	// testowe
	console(){
		console.log(this.movies);
	}
}

class Movie{
	constructor(slug, title, image, runtime, ageCat, genre, movieLabelsArr){
		this.slug = slug;
		this.title = title;
		this.image = image;
		this.runtime = runtime;
		this.ageCat = ageCat;
		this.genre = genre;
		this.projections = {};
		this.movieLabelsArr = movieLabelsArr;
	}

	addProjection(day, time, visualTicketID, if3d, languageVer, specProjLabelArr){

		// sprawdzenie czy są już projekcje dla danego dnia - jeśli nie to trzeba utworzyć dla niego puste pole
		if(this.projections[day] === undefined || this.projections[day] === null){
			this.projections[day] = {};
		}
		this.projections[day][time] = {	'visualTicketID': visualTicketID,
										'if3d': if3d,
										'languageVer': languageVer,
										'specProjLabelArr': specProjLabelArr};
	}
}


export default GenerateSchedule;

// Zrefaktoryzować przedewszystkim "forEach" po obiektach obiektu, funkcję fillScheduleHTML