// klasa Modal przypisuje do wszystkich elementów (btn lub a ale właściwie mogą być też innych typów) o klasie btn--openModal wyświetlania modala/overlay
// każdy taki element musi mieć atrybut data-open-modal w którym wskazany jest selektor modala, który ma wyświetlać

// np. przy atrybucie data-open-modal="#priceList-more" ma wyświetlić się element o id priceList-more

class Modal{
    constructor(){
        // dla wszystkich elementów (w uproszczeniu "przycisków") przypisanie na click funkcji otwierającej modal
        this.addEventListenerAll('.btn--openModal', 'click', this.addModalOpenEventListener.bind(this)); 
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

            // przypisanie przyciskowi zamknięcia danego oraz "tłu" modala (modalObj) event handlera zamykającego modal 
            // przycisk zawsze ma klasę .modal__closeBtn
            const currModalCloseBtn = modalObj.querySelector('.modal__closeBtn');
            currModalCloseBtn.addEventListener('click', this.hideModal.bind(modalObj));

            // przypadek kliknięcia "tła" modala
            this.addOutsideModalEventListener(modalObj);

        } else {
            console.log(`Modal.js - Nie można przypisać eventListenera ${eventType} dla ${btn.innerText} ponieważ nie istnieje dla niego odpowiedni modal`);
        }
    }

    // metoda iterująca po tablicy/NodeList (btnNL) elementów i przypisująca im funkcje obsługi zdarzenia (callback)
    addEventListenerAll(buttonsSelector, eventType = 'click', callbackFunc){
        const buttonsSelectedArr = [...document.querySelectorAll(buttonsSelector)]; //tablica obiektów w DOM (button/a) wybranych za pomocą selektora
        buttonsSelectedArr.forEach(btn => callbackFunc(btn, eventType)); //dla każdego elementu w tablicy dodanie jako obsugi zdarzenia eventType (np. click) funkcji callbackFunc
    }

    // metoda ukrywająca modal (przez odebranie mu klasy .modal--is-visible)
    // modal przekazywany jest w this
    hideModal(){
        // sprawdzenie czy przekazano cokolwiek jako this i czy przekazany element ma klasę modal--is-visible
        // bo ukrycie modala polega na jej odebraniu

        if(this !== undefined && this !== null && this.classList.contains('modal--is-visible')){
            this.classList.remove('modal--is-visible');
        }
    }

    // metoda obsługi przypadku kliknięcia w "tło" wyświetlonego modala (przekazany - obiekt jako modalObj)
    // przypisuje event listener w którego obsłudze jest sprawdzane, czy jest to "tło" modala
    // jeśli tak to modal jest ukrywany
    addOutsideModalEventListener(modalObj){

            // dodanie obsługi kliknięcia w obiekt window, które sprawdza, czy kliknięto w modalObj (czy e.target zawiera obiekt modalObj)
            // (i tylko w niego, nie żadne jego elementy - w ten sposób przechwytujemy kliknięcie tylko i wyłącznie w "tło")
            window.addEventListener('click', (e) => {
                if(e.target === modalObj){
                    // użycie metody hideModal ukrywającej modal z przekazaniem jako this modalObj (aktualnego obiektu modala)
                    this.hideModal.bind(modalObj)();
                }
            });
    }
}

export default Modal;