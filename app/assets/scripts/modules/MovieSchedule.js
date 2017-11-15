// Moduł do obsługi repertuaru kina - umożliwia wybór dnia, dla którego pokazany zostanie repertuar
class MovieSchedule{

	constructor(){
		this.addBtnsClick();
	}

	addBtnsClick(){
	// funkcja dodająca obsługę kliknięcia dnia na dayPickerze (pomijając dni --inactive)
		const daysBtns = [...document.querySelectorAll('.dayPicker__btn--day')]; //konwersja do Array
		daysBtns.forEach(function(dayBtn){
			if(!dayBtn.classList.contains('dayPicker__btn--day--disabled')){
				dayBtn.addEventListener('click', function(){
					// zapamiętanie aktywnego dotychczas dnia: Btn - czyli przycisk na pickerze i time czyli sama data z atrybutu datetime elementu time - np. 2017-09-13
			        const deactivDayBtn = document.querySelector('.dayPicker__btn--day--selected');
			        const deactivDayTime = deactivDayBtn.getElementsByTagName("time")[0].getAttribute("datetime");

			        // pobranie dnia właśnie wybranego: Time czyli sama data z atrybutu datetime elementu time - np. 2017-09-13
			        const selectedDayTime = this.getElementsByTagName("time")[0].getAttribute("datetime");

					// jeśli wybrano dzień inny niż do tej pory aktywny - ukrycie repertuaru na wcześniej aktywny dzień i wyświetlanie na właśnie wybrany
					if (selectedDayTime !== deactivDayTime){

			        	// dodanie i odebranie klasy ukrywającej dzień repertuaru       
				        const dayToHide = document.querySelector('.movieSchedule__ofDay[day="'+ deactivDayTime +'"]');
				        const dayToShow = document.querySelector('.movieSchedule__ofDay[day="'+ selectedDayTime +'"]');

				        if (dayToHide != null && dayToHide !== undefined && dayToShow != null && dayToShow !== undefined) {
							// jeśli udało się pobrać article dla odpowiednich dni - wyświetlenie wybranego i ukrycie dotychczasowego, oraz zmiana "wybranego" przycisku       
							dayToHide.classList.add("visually-hidden");
							dayToShow.classList.remove("visually-hidden");

							// dezaktywacja przycisku dotychczasowej daty
							deactivDayBtn.classList.remove("dayPicker__btn--day--selected");
							// aktywacja przycisku wybranej właśnie daty (kliknięty przycisk to this)
							this.classList.add("dayPicker__btn--day--selected");
						} else {
							console.log("Nie udało się znaleźć odpowiedniego dnia repertuaru");
						}

			        } else {
			        	// TESTOWE
			        	console.log("Wybrano ten sam dzień");
			        }
				});
			}
		});
	}

}

export default MovieSchedule;

// Do zrobienia: 
// - osobne definiowanie klass css (żeby łatwo było zmienić)
// - przenieść eventListenera dla przycisków do elementu nadrzędnego i użyć delegacji (???)
// - funkcjonalność "przesuwania" dni
// - responsywność
// - styl nie tylko za pomocą grid i flexbox
// - dopracować wygląd