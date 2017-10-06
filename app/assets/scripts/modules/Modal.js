// klasa Modal przypisuje do wszystkich elementów (btn lub a) o klasie btn--openModal wyświetlania modala/overlay
// każdy taki element musi mieć atrybut data-open-modal w którym wskazany jest selektor modala, który ma wyświetlać

// np. przy atrybucie data-open-modal="#priceList-more" ma wyświetlić się element o id priceList-more

class Modal{
    constructor(){
        
        this.addEventListenerAll('.btn--openModal', 'click', this.addModalOpenEventListener); 
    }

    // metoda przypisująca buttonowi/linkowi obsługę zdarzenia (domyślnie click) tak aby wyświetlał on modal (element strony)
    // o selektorze podanym w atrybucie data-open-modal danemu przyciskowi
    // działa tylko jeśli dla btn zdefiniowano wartość atrybutu data-open-modal i w DOM istnieje element o selektorze podanym w tym atrybucie przycisku
    addModalOpenEventListener(btn, eventType = 'click'){ 
        const openModalSelector = btn.dataset.openModal; //stała przyjmująca wartość z data-open-modal przycisku/linku (selektor modala do wyświetlenia)
        const modalObj = document.body.querySelector(openModalSelector); //modal, który ma być wyświetlony [może być undefined, jeśli takiego nie ma]

        if(modalObj !== undefined && modalObj !== null){
        // jeśli w DOM istnieje element wskazujący na modal to przypisywany jest handler, który będzie po wystąpieniu zdarzenia (kliknięciu) dodawał klasę odpowiedzialną za widoczność modala
            btn.addEventListener(eventType, () => modalObj.classList.add('modal--is-visible'));
        } else {
            console.log(`Modal.js - Nie można przypisać eventListenera ${eventType} dla ${btn.innerText} ponieważ nie istnieje dla niego odpowiedni modal`);
        }
    }

    // metoda iterująca po tablicy/NodeList (btnNL) elementów i przypisująca im funkcje obsługi zdarzenia
    addEventListenerAll(buttonsSelector, eventType = 'click', callbackFunc){
        const buttonsSelectedArr = [...document.querySelectorAll(buttonsSelector)]; //tablica obiektów w DOM (button/a) wybranych za pomocą selektora
        buttonsSelectedArr.forEach(btn => callbackFunc(btn, eventType)); //dla każdego elementu w tablicy dodanie jako obsugi zdarzenia eventType (np. click) funkcji callbackFunc
    }


}

export default Modal;