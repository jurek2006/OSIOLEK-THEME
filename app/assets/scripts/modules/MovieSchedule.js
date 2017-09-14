// Moduł do obsługi repertuaru kina - umożliwia wybór dnia, dla którego pokazany zostanie repertuar
class MovieSchedule{

	constructor(){
		this.scheduleDaysBtns = document.querySelectorAll('.dayPicker__btn--day');
		this.addBtnsClick();
	}

	addBtnsClick(){
	// funkcja dodająca obsługę kliknięcia dnia na dayPickerze (pomijając dni --inactive)
		this.scheduleDaysBtns.forEach(function(dayBtn){
			if(!dayBtn.classList.contains('dayPicker__btn--day--inactive')){
				dayBtn.addEventListener('click', function(){
					console.log(this);
				});
			}
		});
	}

}



export default MovieSchedule;